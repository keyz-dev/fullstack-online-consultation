"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Q_and_As",
      [
        {
          question: "What are the common symptoms of COVID-19?",
          answer:
            "Common symptoms include fever, cough, fatigue, loss of taste or smell, sore throat, headache, and body aches. Severe symptoms may include difficulty breathing, chest pain, and confusion.",
          category: "infectious_diseases",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "How often should I get a physical checkup?",
          answer:
            "Adults should get a physical checkup at least once a year. However, the frequency may vary based on age, health conditions, and risk factors. Consult with your doctor for personalized recommendations.",
          category: "preventive_care",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "What is the recommended daily water intake?",
          answer:
            "The general recommendation is 8 glasses (64 ounces) of water per day, but this varies based on factors like age, weight, activity level, and climate. Listen to your body's thirst signals.",
          category: "nutrition",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "How can I manage stress and anxiety?",
          answer:
            "Effective stress management includes regular exercise, meditation, deep breathing exercises, adequate sleep, maintaining a healthy diet, and seeking professional help when needed.",
          category: "mental_health",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "What are the warning signs of a heart attack?",
          answer:
            "Warning signs include chest pain or pressure, pain spreading to arms, neck, or jaw, shortness of breath, nausea, lightheadedness, and cold sweats. Seek immediate medical attention if you experience these symptoms.",
          category: "emergency_care",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "How much sleep do adults need?",
          answer:
            "Most adults need 7-9 hours of sleep per night. Quality sleep is essential for physical health, mental well-being, and cognitive function.",
          category: "sleep_health",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "What are the benefits of regular exercise?",
          answer:
            "Regular exercise improves cardiovascular health, strengthens muscles and bones, boosts mood, helps maintain healthy weight, reduces risk of chronic diseases, and improves sleep quality.",
          category: "fitness",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "How can I maintain a healthy diet?",
          answer:
            "A healthy diet includes plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive salt. Portion control is also important.",
          category: "nutrition",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "What should I do if I have a fever?",
          answer:
            "Rest, stay hydrated, take acetaminophen or ibuprofen for comfort, and monitor your temperature. Seek medical attention if fever is high (above 103°F/39.4°C) or persists for more than 3 days.",
          category: "home_care",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "How can I prevent the common cold?",
          answer:
            "Prevent colds by washing hands frequently, avoiding close contact with sick people, maintaining a healthy lifestyle, getting adequate sleep, and considering vitamin C supplements.",
          category: "preventive_care",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Q_and_As", null, {});
  },
};
