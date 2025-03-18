import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL, // Your email address (set this in your .env file)
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
});

export const sendMail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL, // Sender address
            to,                      // Receiver's email address
            subject,                 // Email subject
            text,                    // Email text content
        };

        await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully');
        return true;
    } catch (error) {
        // console.error('Error sending email:', error.message);
        throw new Error('Error sending email: ' + error.message);
    }
};
