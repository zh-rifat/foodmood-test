import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "mail.it-mart.online",
  port: 465,
  secure: true,
  auth: {
    user: process.env.WEBMAIL_USERNAME,
    pass: process.env.WEBMAIL_PASSWORD
  },
});


export const sendOTP=async(email:string,otp:string)=>{
  try {
    const info = await transporter.sendMail({
      from: 'foodmood@it-mart.online', // sender address
      to: email, // list of receivers
      subject: "OTP for Email verification", // Subject line
      text: `Your OTP for email verification is ${otp}. This otp is valid for next 1 hour.`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    throw error;
  }
}

