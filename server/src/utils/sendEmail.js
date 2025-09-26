import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // FIXED: Đúng tên method là createTransport (không có "er")
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App Password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions = {
      from: {
        name: 'Your App Name',
        address: process.env.EMAIL_USER
      },
      to: options.email,
      subject: options.subject,
      html: options.message,
      text: options.message.replace(/<[^>]*>/g, ''),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};

export default sendEmail;