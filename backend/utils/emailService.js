const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Email service for sending emails
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Send email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   * @returns {Promise} - Email send result
   */
  async send(options) {
    const mailOptions = {
      from: `Dudu Store <${process.env.EMAIL_USERNAME}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send welcome email
   * @param {Object} user - User object
   * @returns {Promise} - Email send result
   */
  async sendWelcome(user) {
    return await this.send({
      to: user.email,
      subject: 'Welcome to Dudu Store!',
      text: `Hi ${user.first_name},\n\nWelcome to Dudu Store! We're excited to have you on board.\n\nBest regards,\nThe Dudu Store Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b9d;">Welcome to Dudu Store!</h2>
          <p>Hi ${user.first_name},</p>
          <p>Welcome to Dudu Store! We're excited to have you on board.</p>
          <p>Start exploring our premium squishy collection today!</p>
          <a href="https://dudustore.com/products" style="display: inline-block; background-color: #ff6b9d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Shop Now</a>
          <p style="margin-top: 30px;">Best regards,<br>The Dudu Store Team</p>
        </div>
      `
    });
  }

  /**
   * Send password reset email
   * @param {Object} user - User object
   * @param {string} resetToken - Password reset token
   * @returns {Promise} - Email send result
   */
  async sendPasswordReset(user, resetToken) {
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    return await this.send({
      to: user.email,
      subject: 'Your Password Reset Token (valid for 10 minutes)',
      text: `Hi ${user.first_name},\n\nForgot your password? Submit a PATCH request with your new password to: ${resetURL}\n\nIf you didn't forget your password, please ignore this email.\n\nBest regards,\nThe Dudu Store Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b9d;">Password Reset</h2>
          <p>Hi ${user.first_name},</p>
          <p>Forgot your password? Click the button below to reset it:</p>
          <a href="${resetURL}" style="display: inline-block; background-color: #ff6b9d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Reset Password</a>
          <p style="margin-top: 30px;">If you didn't forget your password, please ignore this email.</p>
          <p>Best regards,<br>The Dudu Store Team</p>
        </div>
      `
    });
  }

  /**
   * Send order confirmation email
   * @param {Object} order - Order object with user and items
   * @returns {Promise} - Email send result
   */
  async sendOrderConfirmation(order) {
    return await this.send({
      to: order.user.email,
      subject: `Order Confirmation #${order.id.substring(0, 8)}`,
      text: `Hi ${order.user.first_name},\n\nThank you for your order! Your order #${order.id.substring(0, 8)} has been received and is being processed.\n\nBest regards,\nThe Dudu Store Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b9d;">Order Confirmation</h2>
          <p>Hi ${order.user.first_name},</p>
          <p>Thank you for your order! Your order <strong>#${order.id.substring(0, 8)}</strong> has been received and is being processed.</p>
          <p>Order Total: <strong>${formatPrice(order.total_amount)}</strong></p>
          <a href="${process.env.FRONTEND_URL}/orders/${order.id}" style="display: inline-block; background-color: #ff6b9d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Order</a>
          <p style="margin-top: 30px;">Best regards,<br>The Dudu Store Team</p>
        </div>
      `
    });
  }
}

/**
 * Format price as currency
 * @param {number} price - Price to format
 * @returns {string} - Formatted price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

module.exports = new EmailService();