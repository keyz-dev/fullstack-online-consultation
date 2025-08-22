"use strict";

const { ContactInformation } = require("../db/models");
const { BadRequestError, NotFoundError } = require("../utils/errors");

// Get all active contact information options
const getContactInformationOptions = async (req, res) => {
  try {
    const contactInfo = await ContactInformation.findAll({
      where: {
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
      attributes: [
        "id",
        "name",
        "iconUrl",
        "inputType",
        "placeholder",
        "validationPattern",
        "isRequired",
        "displayOrder",
      ],
    });

    res.json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    console.error("Error fetching contact information options:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact information options",
    });
  }
};

// Get contact information by ID (admin only)
const getContactInformationById = async (req, res) => {
  try {
    const { id } = req.params;

    const contactInfo = await ContactInformation.findByPk(id);

    if (!contactInfo) {
      throw new NotFoundError("Contact information not found");
    }

    res.json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error("Error fetching contact information:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contact information",
      });
    }
  }
};

// Create new contact information (admin only)
const createContactInformation = async (req, res) => {
  try {
    const {
      name,
      iconUrl,
      inputType,
      placeholder,
      validationPattern,
      isRequired,
      displayOrder,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name || !inputType) {
      throw new BadRequestError("Name and input type are required");
    }

    // Validate input type
    const validInputTypes = ["phone", "email", "url", "text", "time"];
    if (!validInputTypes.includes(inputType)) {
      throw new BadRequestError("Invalid input type");
    }

    const contactInfo = await ContactInformation.create({
      name: name.trim(),
      iconUrl: iconUrl || "defaultIcon.png",
      inputType,
      placeholder,
      validationPattern,
      isRequired: isRequired || false,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      data: contactInfo,
      message: "Contact information created successfully",
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error("Error creating contact information:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create contact information",
      });
    }
  }
};

// Update contact information (admin only)
const updateContactInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      iconUrl,
      inputType,
      placeholder,
      validationPattern,
      isRequired,
      displayOrder,
      isActive,
    } = req.body;

    const contactInfo = await ContactInformation.findByPk(id);

    if (!contactInfo) {
      throw new NotFoundError("Contact information not found");
    }

    // Validate input type if provided
    if (inputType) {
      const validInputTypes = ["phone", "email", "url", "text", "time"];
      if (!validInputTypes.includes(inputType)) {
        throw new BadRequestError("Invalid input type");
      }
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
    if (inputType !== undefined) updateData.inputType = inputType;
    if (placeholder !== undefined) updateData.placeholder = placeholder;
    if (validationPattern !== undefined)
      updateData.validationPattern = validationPattern;
    if (isRequired !== undefined) updateData.isRequired = isRequired;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await contactInfo.update(updateData);

    res.json({
      success: true,
      data: contactInfo,
      message: "Contact information updated successfully",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    } else if (error instanceof BadRequestError) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error("Error updating contact information:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update contact information",
      });
    }
  }
};

// Delete contact information (admin only)
const deleteContactInformation = async (req, res) => {
  try {
    const { id } = req.params;

    const contactInfo = await ContactInformation.findByPk(id);

    if (!contactInfo) {
      throw new NotFoundError("Contact information not found");
    }

    await contactInfo.destroy();

    res.json({
      success: true,
      message: "Contact information deleted successfully",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error("Error deleting contact information:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete contact information",
      });
    }
  }
};

// Get all contact information (admin only)
const getAllContactInformation = async (req, res) => {
  try {
    const contactInfo = await ContactInformation.findAll({
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    res.json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    console.error("Error fetching all contact information:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact information",
    });
  }
};

module.exports = {
  getContactInformationOptions,
  getContactInformationById,
  createContactInformation,
  updateContactInformation,
  deleteContactInformation,
  getAllContactInformation,
};
