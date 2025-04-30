
/**
 * A mock email service for simulating email delivery in the demo application.
 * In a production environment, this would be replaced with actual email sending functionality
 * through a backend service or API.
 */

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

class EmailService {
  /**
   * Simulates sending an email and returns a promise that resolves
   * after a short delay to mimic network latency.
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    console.log('Sending email to:', options.to);
    console.log('Subject:', options.subject);
    console.log('Body:', options.body);
    
    // Simulate network delay
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would communicate with an email API
        // and could potentially fail, but for our demo we'll always succeed
        console.log('Email sent successfully to', options.to);
        resolve(true);
      }, 1000);
    });
  }

  /**
   * Generates a verification code for email verification.
   * In a real implementation, this would be stored in a database
   * along with the user's email and an expiration time.
   */
  generateVerificationCode(): string {
    // For demo purposes, always return "123456"
    return "123456";
  }

  /**
   * Sends a verification email with the provided code.
   */
  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: "Your verification code",
      body: `Your verification code is: ${code}. Please use this code to verify your email address.`
    });
  }
}

// Export a singleton instance
export const emailService = new EmailService();

