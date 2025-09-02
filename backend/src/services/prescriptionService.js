const { Prescription, Consultation, Patient, Doctor, User, Notification, Appointment } = require("../db/models");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const { uploadToCloudinary } = require("../utils/cloudinary");
const emailService = require("./emailService");
const path = require("path");
const fs = require("fs");

class PrescriptionService {
  // Create a new prescription
  static async createPrescription(prescriptionData) {
    try {
      const prescription = await Prescription.create(prescriptionData);
      logger.info(`Prescription created successfully: ${prescription.id}`);
      return prescription;
    } catch (error) {
      logger.error("Error creating prescription:", error);
      throw error;
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
      const consultation = await Consultation.findByPk(prescription.consultationId, {
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
      });

      // Attach the consultation with appointment details to the prescription
      prescription.consultation = consultation;

      return prescription;
    } catch (error) {
      logger.error("Error fetching prescription:", error);
      throw error;
    }
  }

  // Get prescriptions by consultation ID
  static async getPrescriptionsByConsultation(consultationId) {
    try {
      console.log("\n\nGetting prescriptions by consultation ID:", consultationId);

      // First, get the prescriptions with basic consultation info

      const prescriptions = await Prescription.findAll()

      // const prescriptions = await Prescription.findAll({
      //   // where: { consultationId },
      //   // include: [
      //   //   {
      //   //     model: Consultation,
      //   //     as: "consultation",
      //   //   },
      //   // ],
      //   // order: [["createdAt", "DESC"]],
      // });

      console.log(prescriptions)

      process.exit(0);

      // Then, for each prescription, get the appointment details separately
      const prescriptionsWithDetails = await Promise.all(
        prescriptions.map(async (prescription) => {
          const consultation = await Consultation.findByPk(prescription.consultationId, {
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
          });

          // Attach the consultation with appointment details to the prescription
          prescription.consultation = consultation;
          return prescription;
        })
      );

      console.log("Prescriptions fetched successfully:", prescriptionsWithDetails);

      return prescriptionsWithDetails;
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

  // Generate PDF prescription
  static async generatePrescriptionPDF(prescriptionId) {
    try {
      const prescription = await this.getPrescriptionById(prescriptionId);
      
      // Generate HTML template
      const htmlContent = this.generatePrescriptionHTML(prescription);
      
      // Generate PDF using Puppeteer
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });
      
      await browser.close();
      
      // Upload to Cloudinary
      const fileUrl = await this.uploadPrescriptionPDF(pdfBuffer, prescriptionId);
      
      // Update prescription with file URL
      await this.updatePrescriptionFileUrl(prescriptionId, fileUrl);
      
      // Send notifications using existing service pattern
      await this.sendPrescriptionNotifications(prescription);
      
      logger.info(`Prescription PDF generated successfully: ${prescriptionId}`);
      return fileUrl;
      
    } catch (error) {
      logger.error("Error generating prescription PDF:", error);
      throw error;
    }
  }

  // Generate prescription HTML template
  static generatePrescriptionHTML(prescription) {
    const consultation = prescription.consultation;
    const appointment = consultation.appointment;
    const patient = appointment.patient;
    const doctor = appointment.doctor;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Prescription - ${patient.user.name}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            color: #333;
            line-height: 1.6;
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
          .patient-info, .doctor-info { 
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
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
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏥 Online Consultation System</div>
          <h1>Medical Prescription</h1>
          <p><strong>Date:</strong> ${new Date(prescription.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p><strong>Prescription ID:</strong> #${prescription.id}</p>
        </div>
        
        <div class="prescription-info">
          <div class="patient-info">
            <h3 class="section-title">👤 Patient Information</h3>
            <p><strong>Full Name:</strong> ${patient.user.name}</p>
            <p><strong>Age:</strong> ${patient.age || 'Not specified'} years</p>
            <p><strong>Gender:</strong> ${patient.gender || 'Not specified'}</p>
            <p><strong>Contact:</strong> ${patient.user.phoneNumber || 'Not provided'}</p>
          </div>
          
          <div class="doctor-info">
            <h3 class="section-title">👨‍⚕️ Prescribing Doctor</h3>
            <p><strong>Name:</strong> Dr. ${doctor.user.name}</p>
            <p><strong>Specialization:</strong> ${doctor.specialization || 'General Medicine'}</p>
            <p><strong>License:</strong> ${doctor.licenseNumber || 'Not provided'}</p>
            <p><strong>Contact:</strong> ${doctor.user.phoneNumber || 'Not provided'}</p>
          </div>
        </div>

        <div class="diagnosis-section">
          <h3 class="section-title">🔍 Diagnosis</h3>
          <p>${prescription.diagnosis || 'Not specified'}</p>
          ${prescription.notes ? `<p><strong>Additional Notes:</strong> ${prescription.notes}</p>` : ''}
        </div>
        
        <div class="medications">
          <h3 class="section-title">💊 Prescribed Medications</h3>
          ${prescription.medications.map((med, index) => `
            <div class="medication-item">
              <div class="medication-header">${index + 1}. ${med.name}</div>
              <div class="medication-details">
                <div><strong>Dosage:</strong> ${med.dosage || 'As prescribed'}</div>
                <div><strong>Frequency:</strong> ${med.frequency || 'As needed'}</div>
                <div><strong>Duration:</strong> ${med.duration || 'As prescribed'}</div>
                <div><strong>Form:</strong> ${med.form || 'Tablet'}</div>
              </div>
              ${med.instructions ? `
                <div style="margin-top: 10px; padding: 10px; background-color: #fef3c7; border-radius: 5px;">
                  <strong>Special Instructions:</strong> ${med.instructions}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <div class="instructions">
          <h3 class="section-title">📋 Treatment Instructions</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div><strong>Treatment Duration:</strong> ${prescription.duration || 'As prescribed'} days</div>
            <div><strong>Number of Refills:</strong> ${prescription.refills || 0}</div>
          </div>
          ${prescription.instructions ? `
            <div style="padding: 15px; background-color: #dbeafe; border-radius: 8px;">
              <strong>General Instructions:</strong><br>
              ${prescription.instructions}
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>This prescription was generated electronically by the Online Consultation System</p>
          <p><strong>Valid until:</strong> ${new Date(Date.now() + (prescription.duration || 30) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p style="margin-top: 10px; color: #dc2626;">
            <strong>Important:</strong> Please follow the prescribed dosage and consult your doctor if you experience any adverse effects.
          </p>
        </div>
      </body>
      </html>
    `;
  }

  // Upload prescription PDF to Cloudinary
  static async uploadPrescriptionPDF(pdfBuffer, prescriptionId) {
    try {
      const uploadResult = await uploadToCloudinary(pdfBuffer, {
        folder: "prescriptions",
        resource_type: "raw",
        format: "pdf",
        public_id: `prescription_${prescriptionId}`,
      });

      logger.info(`Prescription PDF uploaded successfully: ${prescriptionId}`);
      return uploadResult.secure_url;
    } catch (error) {
      logger.error("Error uploading prescription PDF:", error);
      throw error;
    }
  }

  // Update prescription with file URL
  static async updatePrescriptionFileUrl(prescriptionId, fileUrl) {
    try {
      await this.updatePrescription(prescriptionId, { fileUrl });
      logger.info(`Prescription file URL updated: ${prescriptionId}`);
      return true;
    } catch (error) {
      logger.error("Error updating prescription file URL:", error);
      throw error;
    }
  }

  // Get prescription statistics
  static async getPrescriptionStats(doctorId = null, patientId = null) {
    try {
      let whereClause = {};
      
      if (doctorId || patientId) {
        // Get consultations that match the criteria
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
          attributes: ['id'],
        });
        
        const consultationIds = consultations.map(c => c.id);
        whereClause.consultationId = { [require('sequelize').Op.in]: consultationIds };
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
  static async sendPrescriptionNotifications(prescription) {
    try {
      const consultation = prescription.consultation;
      const appointment = consultation.appointment;
      const patient = appointment.patient;
      const doctor = appointment.doctor;

      // Create notification for patient
      await Notification.create({
        user_id: patient.userId,
        type: 'prescription',
        title: 'New Prescription Available',
        message: `Your prescription has been generated by Dr. ${doctor.user.name}`,
        priority: 'high',
        data: {
          prescriptionId: prescription.id,
          consultationId: consultation.id,
          category: 'prescriptions'
        }
      });

      // Create notification for doctor
      await Notification.create({
        user_id: doctor.userId,
        type: 'prescription',
        title: 'Prescription Generated',
        message: `Prescription for ${patient.user.name} has been generated successfully`,
        priority: 'medium',
        data: {
          prescriptionId: prescription.id,
          consultationId: consultation.id,
          category: 'prescriptions'
        }
      });

      // Send email to patient following system pattern
      if (emailService && patient.user.email) {
        try {
          const emailInstance = new emailService();
          await emailInstance.sendEmail({
            to: patient.user.email,
            subject: 'Your Prescription is Ready',
            templateName: 'prescription-generated', // We'll need to create this template
            templateData: {
              patientName: patient.user.name,
              doctorName: doctor.user.name,
              prescriptionId: prescription.id,
              diagnosis: prescription.diagnosis,
              medications: prescription.medications
            }
          });
          logger.info(`Prescription email sent to patient: ${patient.user.email}`);
        } catch (emailError) {
          logger.warn('Failed to send prescription email:', emailError);
        }
      }

      logger.info(`Prescription notifications sent successfully: ${prescription.id}`);
    } catch (error) {
      logger.error("Error sending prescription notifications:", error);
      // Don't throw error here as this is a secondary operation
    }
  }
}

module.exports = PrescriptionService;
