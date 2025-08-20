"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Specialties",
      [
        {
          name: "Cardiology",
          description:
            "Specializes in heart and cardiovascular system disorders",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dermatology",
          description: "Specializes in skin, hair, and nail conditions",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Endocrinology",
          description: "Specializes in hormone-related disorders and diabetes",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Gastroenterology",
          description: "Specializes in digestive system disorders",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Neurology",
          description: "Specializes in nervous system disorders",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Oncology",
          description: "Specializes in cancer diagnosis and treatment",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Orthopedics",
          description: "Specializes in bone and joint disorders",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pediatrics",
          description: "Specializes in children's health and development",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Psychiatry",
          description: "Specializes in mental health and behavioral disorders",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pulmonology",
          description: "Specializes in respiratory system disorders",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Radiology",
          description: "Specializes in medical imaging and diagnosis",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Urology",
          description:
            "Specializes in urinary system and male reproductive health",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "General Medicine",
          description: "Provides comprehensive primary care for adults",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Family Medicine",
          description: "Provides comprehensive care for all family members",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Emergency Medicine",
          description: "Specializes in acute care and emergency situations",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Specialties", null, {});
  },
};
