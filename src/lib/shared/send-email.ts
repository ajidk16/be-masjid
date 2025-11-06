import { Resend } from "resend";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import OtpEmail from "../../emails/otp";

export const resend = new Resend(process.env.RESEND_API_KEY!);

type SendEmailToGmailParams = {
  email: string;
  subject?: string;
  expiresInMin?: string;
  verifyUrl: string;
  logoUrl?: string;
};

export const sendEmailToGmail = async ({
  email,
  subject,
  expiresInMin,
  verifyUrl,
  logoUrl,
}: SendEmailToGmailParams) => {
  const html = renderToStaticMarkup(
    React.createElement(OtpEmail, {
      appName: "Todo List",
      expiresInMin: expiresInMin,
      verifyUrl: verifyUrl,
      logoUrl: logoUrl,
    })
  );

  await resend.emails.send({
    from: "Todo List <noreply@todo-list.dkaji.my.id>",
    to: email,
    subject: subject ? subject : "Your OTP Code",
    html: html,
  });
};
