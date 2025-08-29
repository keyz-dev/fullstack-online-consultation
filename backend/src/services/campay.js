const axios = require("axios");
const logger = require("../utils/logger");

class CampayService {
  constructor() {
    this.baseURL = process.env.CAMPAY_API_URL || "https://demo.campay.net/api";
    this.appId = process.env.CAMPAY_APP_ID;
    this.username = process.env.CAMPAY_USERNAME;
    this.password = process.env.CAMPAY_APP_PASSWORD;
    this.permanentToken = process.env.CAMPAY_PERMANENT_ACCESS_TOKEN;
  }

  async getAccessToken() {
    try {
      // Use permanent token if available, otherwise authenticate
      if (this.permanentToken) {
        return this.permanentToken;
      }

      const response = await axios.post(`${this.baseURL}/token/`, {
        username: this.username,
        password: this.password,
      });
      return response.data.token;
    } catch (error) {
      logger.error(
        "Error getting Campay access token:",
        error.response?.data || error.message
      );
      throw new Error("Failed to authenticate with Campay");
    }
  }

  // Initiate a payment collection
  async initiatePayment(paymentData) {
    try {
      const token = await this.getAccessToken();

      const payload = {
        // amount: paymentData.amount.toString(),
        amount: 2,
        currency: paymentData.currency || "XAF",
        from: paymentData.phoneNumber,
        description: paymentData.description,
        external_reference: paymentData.orderId,
        return_url: `${process.env.SERVER_URL}/api/payment/success`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
      };

      const response = await axios.post(`${this.baseURL}/collect/`, payload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      logger.error(
        "Error initiating Campay payment:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Payment initiation failed"
      );
    }
  }

  // Check payment status
  async checkPaymentStatus(reference) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseURL}/transaction/${reference}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error(`Error checking payment status for ${reference}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // For demo/test environment, don't throw error immediately
      // Return a pending status to continue polling
      if (error.response?.status === 404) {
        logger.warn(
          `Payment ${reference} not found in Campay - might still be processing`
        );
        return { status: "PENDING", reference };
      }

      throw new Error(
        `Failed to check payment status: ${error.response?.data?.message || error.message}`
      );
    }
  }
}

module.exports = new CampayService();
