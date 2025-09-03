const {
  Prescription,
  Appointment,
  Consultation,
  Patient,
  Doctor,
  User,
  Notification,
} = require("../db/models");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const { uploadToCloudinary } = require("../utils/cloudinary");
const emailService = require("./emailService");
const {
  formatPrescriptionData,
  formatPrescriptionsData,
} = require("../utils/returnFormats/prescriptionData");
const fs = require("fs").promises;
const path = require("path");
const notificationService = require("./appointmentNotificationService");

class PrescriptionService {
  // Create a new prescription with PDF generation
  static async createPrescription(prescriptionData) {
    let prescription = null;

    try {
      logger.info("Starting complete prescription creation process");

      // Step 1: Generate PDF with multiple fallback methods
      const pdfResult =
        await this.generatePrescriptionPDFWithFallbacks(prescriptionData);
      logger.info(
        `PDF generated successfully using method: ${pdfResult.method}`
      );

      // Step 2: Upload PDF to storage (Cloudinary or local)
      const fileUrl = await this.uploadPrescriptionFile(
        pdfResult.buffer,
        `prescription_${Date.now()}`,
        pdfResult.contentType
      );
      logger.info(`PDF uploaded successfully: ${fileUrl}`);

      // Step 3: Create prescription record with file URL
      const prescriptionDataWithFile = {
        ...prescriptionData,
        fileUrl: fileUrl,
        status: "active",
        startDate: new Date(),
      };

      // Get the patientId from the consultation's appointment.
      const consultation = await Consultation.findByPk(
        prescriptionData.consultationId,
        {
          include: [
            {
              model: Appointment,
              as: "appointment",
              include: [
                {
                  model: Patient,
                  as: "patient",
                  include: [{ model: User, as: "user" }],
                },
                {
                  model: Doctor,
                  as: "doctor",
                  include: [{ model: User, as: "user" }],
                },
              ],
            },
          ],
        }
      );

      prescription = await Prescription.create({
        ...prescriptionDataWithFile,
        patientId: consultation.appointment.patientId,
        doctorId: consultation.appointment.doctorId,
      });
      logger.info(`Prescription record created: ${prescription.id}`);

      // Step 4: Send notifications to both parties (NOW that PDF is ready)
      await this.sendPrescriptionNotifications(prescription, consultation);
      logger.info(`Notifications sent for prescription: ${prescription.id}`);

      logger.info(`Complete prescription process finished: ${prescription.id}`);
      return prescription;
    } catch (error) {
      logger.error("Error in complete prescription creation process:", error);

      // If prescription was created but other steps failed, update its status
      if (prescription) {
        try {
          await prescription.update({
            status: "active", // Keep as active since prescription exists
            notes:
              prescription.notes +
              " (PDF generation encountered issues but prescription is valid)",
          });
          logger.info(
            `Prescription ${prescription.id} marked as active despite PDF issues`
          );
        } catch (updateError) {
          logger.error("Failed to update prescription status:", updateError);
        }
      }

      throw error;
    }
  }

  // Enhanced PDF generation with multiple fallback methods
  static async generatePrescriptionPDFWithFallbacks(prescriptionData) {
    const methods = [
      {
        name: "puppeteer-optimized",
        method: this.generatePDFWithOptimizedPuppeteer,
      },
      { name: "puppeteer-basic", method: this.generatePDFWithBasicPuppeteer },
      { name: "html-pdf", method: this.generatePDFWithHtmlPdf },
      { name: "html-buffer", method: this.generateHTMLBuffer },
    ];

    for (const { name, method } of methods) {
      try {
        logger.info(`Attempting PDF generation with method: ${name}`);
        const result = await method.call(this, prescriptionData);
        logger.info(`Successfully generated PDF with method: ${name}`);
        return {
          buffer: result,
          method: name,
          contentType: name === "html-buffer" ? "text/html" : "application/pdf",
        };
      } catch (error) {
        logger.warn(`PDF generation method ${name} failed:`, error.message);
        continue;
      }
    }

    throw new Error("All PDF generation methods failed");
  }

  // Method 1: Optimized Puppeteer with better configuration
  static async generatePDFWithOptimizedPuppeteer(prescriptionData) {
    const puppeteer = require("puppeteer");
    let browser = null;

    try {
      // Enhanced browser launch options for better stability
      const launchOptions = {
        headless: "new", // Use new headless mode
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--single-process", // This helps with Windows file locking issues
        ],
        timeout: 45000, // Increased timeout
        ignoreDefaultArgs: ["--disable-extensions"], // Allow some default args
      };

      // Add Windows-specific options
      if (process.platform === "win32") {
        launchOptions.args.push("--disable-features=VizDisplayCompositor");
      }

      browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();

      // Set page timeouts
      page.setDefaultNavigationTimeout(30000);
      page.setDefaultTimeout(30000);

      const htmlContent =
        this.generatePrescriptionHTMLFromData(prescriptionData);

      await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
        timeout: 30000,
      });

      return pdfBuffer;
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          logger.warn("Error closing browser:", closeError.message);
        }
      }
    }
  }

  // Method 2: Basic Puppeteer with minimal options
  static async generatePDFWithBasicPuppeteer(prescriptionData) {
    const puppeteer = require("puppeteer");
    let browser = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
        timeout: 30000,
      });

      const page = await browser.newPage();
      const htmlContent =
        this.generatePrescriptionHTMLFromData(prescriptionData);

      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      return pdfBuffer;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  // Method 3: Using html-pdf library as alternative
  static async generatePDFWithHtmlPdf(prescriptionData) {
    try {
      const htmlPdf = require("html-pdf");
      const htmlContent =
        this.generatePrescriptionHTMLFromData(prescriptionData);

      return new Promise((resolve, reject) => {
        const options = {
          format: "A4",
          border: {
            top: "20mm",
            right: "20mm",
            bottom: "20mm",
            left: "20mm",
          },
          timeout: 30000,
        };

        htmlPdf.create(htmlContent, options).toBuffer((err, buffer) => {
          if (err) reject(err);
          else resolve(buffer);
        });
      });
    } catch (error) {
      throw new Error(`html-pdf generation failed: ${error.message}`);
    }
  }

  // Method 4: HTML fallback (when PDF generation completely fails)
  static async generateHTMLBuffer(prescriptionData) {
    logger.info("Using HTML buffer as final fallback");
    const htmlContent = this.generatePrescriptionHTMLFromData(prescriptionData);
    return Buffer.from(htmlContent, "utf8");
  }

  // Enhanced file upload that handles both PDF and HTML
  static async uploadPrescriptionFile(
    fileBuffer,
    fileName,
    contentType = "application/pdf"
  ) {
    const inProduction = process.env.NODE_ENV === "production";

    if (inProduction) {
      // Upload to Cloudinary
      const uploadOptions = {
        folder: "prescriptions",
        resource_type: contentType === "application/pdf" ? "raw" : "auto",
        format: contentType === "application/pdf" ? "pdf" : "html",
        public_id: fileName,
      };

      const result = await uploadToCloudinary(fileBuffer, uploadOptions);
      return result.secure_url;
    } else {
      // Save to local uploads folder
      const uploadsDir = path.join(
        process.cwd(),
        "src",
        "uploads",
        "prescriptions"
      );

      // Ensure directory exists
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      const fileExtension = contentType === "application/pdf" ? "pdf" : "html";
      const filePath = path.join(uploadsDir, `${fileName}.${fileExtension}`);

      await fs.writeFile(filePath, fileBuffer);

      // Return the relative path for serving
      return `/uploads/prescriptions/${fileName}.${fileExtension}`;
    }
  }

  // Get prescription by ID with related data
  static async getPrescriptionById(prescriptionId) {
    try {
      const prescription = await Prescription.findByPk(prescriptionId, {
        include: [
          {
            model: Consultation,
            as: "consultation",
          },
        ],
      });

      if (!prescription) {
        throw new NotFoundError("Prescription not found");
      }

      // Get the consultation with appointment details separately
      const consultation = await Consultation.findByPk(
        prescription.consultationId,
        {
          include: [
            {
              model: Appointment,
              as: "appointment",
              include: [
                {
                  model: Patient,
                  as: "patient",
                  include: [{ model: User, as: "user" }],
                },
                {
                  model: Doctor,
                  as: "doctor",
                  include: [{ model: User, as: "user" }],
                },
              ],
            },
          ],
        }
      );

      // Attach the consultation with appointment details to the prescription
      prescription.consultation = consultation;

      // Format the prescription data using the utility
      return formatPrescriptionData(prescription, {
        includeConsultation: true,
        includePatient: true,
        includeDoctor: true,
      });
    } catch (error) {
      logger.error("Error fetching prescription:", error);
      throw error;
    }
  }

  // Get prescriptions by consultation ID
  static async getPrescriptionsByConsultation(consultationId) {
    try {
      logger.info("Getting prescriptions by consultation ID:", consultationId);

      const prescriptions = await Prescription.findAll({
        where: { consultationId },
        include: [
          {
            model: Consultation,
            as: "consultation",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Then, for each prescription, get the appointment details separately
      const prescriptionsWithDetails = await Promise.all(
        prescriptions.map(async (prescription) => {
          const consultation = await Consultation.findByPk(
            prescription.consultationId,
            {
              include: [
                {
                  model: Appointment,
                  as: "appointment",
                  include: [
                    {
                      model: Patient,
                      as: "patient",
                      include: [{ model: User, as: "user" }],
                    },
                    {
                      model: Doctor,
                      as: "doctor",
                      include: [{ model: User, as: "user" }],
                    },
                  ],
                },
              ],
            }
          );

          // Attach the consultation with appointment details to the prescription
          prescription.consultation = consultation;
          return prescription;
        })
      );

      logger.info(
        "Prescriptions fetched successfully:",
        prescriptionsWithDetails.length
      );

      // Format the prescriptions data using the utility
      return formatPrescriptionsData(prescriptionsWithDetails, {
        includeConsultation: true,
        includePatient: true,
        includeDoctor: true,
      });
    } catch (error) {
      logger.error("Error fetching prescriptions by consultation:", error);
      throw error;
    }
  }

  // Update prescription
  static async updatePrescription(prescriptionId, updateData) {
    try {
      const prescription = await Prescription.findByPk(prescriptionId);
      if (!prescription) {
        throw new NotFoundError("Prescription not found");
      }

      await prescription.update(updateData);
      logger.info(`Prescription updated successfully: ${prescriptionId}`);
      return prescription;
    } catch (error) {
      logger.error("Error updating prescription:", error);
      throw error;
    }
  }

  // Delete prescription
  static async deletePrescription(prescriptionId) {
    try {
      const prescription = await Prescription.findByPk(prescriptionId);
      if (!prescription) {
        throw new NotFoundError("Prescription not found");
      }

      await prescription.destroy();
      logger.info(`Prescription deleted successfully: ${prescriptionId}`);
      return true;
    } catch (error) {
      logger.error("Error deleting prescription:", error);
      throw error;
    }
  }

  // Generate prescription statistics
  static async getPrescriptionStats(doctorId = null, patientId = null) {
    try {
      let whereClause = {};

      if (doctorId || patientId) {
        const consultationWhere = {};
        if (doctorId || patientId) {
          consultationWhere.include = [
            {
              model: Appointment,
              as: "appointment",
              where: {
                ...(doctorId && { doctorId }),
                ...(patientId && { patientId }),
              },
            },
          ];
        }

        const consultations = await Consultation.findAll({
          where: consultationWhere,
          attributes: ["id"],
        });

        const consultationIds = consultations.map((c) => c.id);
        whereClause.consultationId = {
          [require("sequelize").Op.in]: consultationIds,
        };
      }

      const totalPrescriptions = await Prescription.count({
        where: whereClause,
      });

      const activePrescriptions = await Prescription.count({
        where: { ...whereClause, status: "active" },
      });

      const completedPrescriptions = await Prescription.count({
        where: { ...whereClause, status: "completed" },
      });

      return {
        total: totalPrescriptions,
        active: activePrescriptions,
        completed: completedPrescriptions,
      };
    } catch (error) {
      logger.error("Error fetching prescription statistics:", error);
      throw error;
    }
  }

  // Send prescription notifications following system patterns
  static async sendPrescriptionNotifications(prescription, consultation) {
    try {
      const appointment = consultation.appointment;
      const patient = appointment.patient;
      const doctor = appointment.doctor;

      const patientPayload = {
        userId: patient.user.id,
        type: "prescription_ready",
        title: "Prescription is Ready",
        message: `Your prescription has been generated by Dr. ${doctor.user.name} and is now available for download.`,
        priority: "high",
        data: {
          prescriptionId: prescription.id,
          consultationId: consultation.id,
          category: "prescriptions",
        },
      };

      const doctorPayload = {
        userId: doctor.user.id,
        type: "prescription_generated",
        title: "Prescription Generated Successfully",
        message: `Prescription for ${patient.user.name} has been generated and is ready for the patient.`,
        priority: "medium",
        data: patientPayload.data,
      };

      console.log("Patient Payload: ", patientPayload);
      console.log("\nDoctor Payload: ", doctorPayload);

      const patientNotification = await notificationService.createNotification(
        patientPayload.userId,
        patientPayload.type,
        patientPayload.title,
        patientPayload.message,
        patientPayload.priority,
        {
          ...patientPayload.data,
        }
      );

      const doctorNotification = await notificationService.createNotification(
        doctorPayload.userId,
        doctorPayload.type,
        doctorPayload.title,
        doctorPayload.message,
        doctorPayload.priority,
        {
          ...doctorPayload.data,
        }
      );

      // Send email to patient following system pattern
      if (emailService && patient.user.email) {
        try {
          await emailService.sendEmail({
            to: patient.user.email,
            subject: "Your Prescription is Ready - DrogCine",
            template: "prescription-ready",
            data: {
              patientName: patient.user.name,
              doctorName: doctor.user.name,
              prescriptionId: prescription.id,
              diagnosis: prescription.diagnosis,
              medications: prescription.medications,
              portalUrl: `${process.env.FRONTEND_URL}/dashboard`,
              prescriptionUrl: prescription.fileUrl,
            },
          });
          logger.info(
            `Prescription email sent to patient: ${patient.user.email}`
          );
        } catch (emailError) {
          logger.warn("Failed to send prescription email:", emailError);
        }
      }

      logger.info(
        `Prescription notifications sent successfully: ${prescription.id}`
      );
    } catch (error) {
      logger.error("Error sending prescription notifications:", error);
      // Don't throw error here as this is a secondary operation
    }
  }

  // Generate prescription HTML from basic data (for initial creation)
  static generatePrescriptionHTMLFromData(prescriptionData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Medical Prescription</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            color: #333;
            line-height: 1.6;
            background-color: #ffffff;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px;
          }
          .prescription-info { 
            margin-bottom: 30px; 
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .medications { 
            margin-bottom: 30px; 
          }
          .medication-item { 
            border: 1px solid #e2e8f0; 
            padding: 20px; 
            margin-bottom: 15px; 
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            break-inside: avoid;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 12px; 
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          .section-title {
            color: #1e40af;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .medication-header {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
            font-size: 18px;
          }
          .medication-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
          }
          .diagnosis-section {
            grid-column: 1 / -1;
            background-color: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin-bottom: 20px;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .header { page-break-after: avoid; }
            .medication-item { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">DrogCine Medical Platform</div>
          <h1>Medical Prescription</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString("en-US")}</p>
        </div>
        
        <div class="diagnosis-section">
          <h3 class="section-title">Diagnosis</h3>
          <p><strong>${prescriptionData.diagnosis || "Not specified"}</strong></p>
          ${prescriptionData.notes ? `<p><strong>Additional Notes:</strong> ${prescriptionData.notes}</p>` : ""}
        </div>
        
        <div class="medications">
          <h3 class="section-title">Prescribed Medications</h3>
          ${prescriptionData.medications
            .map(
              (med, index) => `
            <div class="medication-item">
              <div class="medication-header">${index + 1}. ${med.name}</div>
              <div class="medication-details">
                <div><strong>Dosage:</strong> ${med.dosage || "As prescribed"}</div>
                <div><strong>Frequency:</strong> ${med.frequency || "As needed"}</div>
                <div><strong>Duration:</strong> ${med.duration || "As prescribed"}</div>
                <div><strong>Form:</strong> ${med.form || "Tablet"}</div>
              </div>
              ${
                med.instructions
                  ? `
                <div style="margin-top: 10px; padding: 10px; background-color: #fef3c7; border-radius: 5px;">
                  <strong>Special Instructions:</strong> ${med.instructions}
                </div>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
        
        <div class="instructions">
          <h3 class="section-title">Treatment Instructions</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div><strong>Treatment Duration:</strong> ${prescriptionData.duration || "As prescribed"} days</div>
            <div><strong>Number of Refills:</strong> ${prescriptionData.refills || 0}</div>
          </div>
          ${
            prescriptionData.instructions
              ? `
            <div style="padding: 15px; background-color: #dbeafe; border-radius: 8px;">
              <strong>General Instructions:</strong><br>
              ${prescriptionData.instructions}
            </div>
          `
              : ""
          }
        </div>
        
        <div class="footer">
          <p>This prescription was generated electronically by DrogCine Medical Platform</p>
          <p><strong>Valid until:</strong> ${new Date(
            Date.now() + (prescriptionData.duration || 30) * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
          <p style="margin-top: 10px; color: #dc2626;">
            <strong>Important:</strong> Please follow the prescribed dosage and consult your doctor if you experience any adverse effects.
          </p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = PrescriptionService;
