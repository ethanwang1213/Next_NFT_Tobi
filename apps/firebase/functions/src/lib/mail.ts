import * as sendgrid from "@sendgrid/mail";

export const sendEmail = async (
    address: string,
    subject: string,
    text: string,
) => {
  const sgAPIKey = process.env.SENDGRID_API_KEY || "SG.xxx";
  sendgrid.setApiKey(sgAPIKey);
  const mailOptions = {
    from: process.env.SENDGRID_SENDER_EMAIL || "",
    to: address,
    bcc: process.env.SENDGRID_SENDER_EMAIL || "",
    subject: subject,
    text: text,
  };
  const response = await sendgrid.send(mailOptions);
  return response[0].statusCode;
};
