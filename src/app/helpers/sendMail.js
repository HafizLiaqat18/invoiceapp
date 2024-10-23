
import nodemailer from "nodemailer"

export async function sendMail( user, pdfBytes ) {
    // console.log(user)
   

    try {
      
        let transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Invoice for Your Tasks",
            text: "Please find attached the invoice for your tasks.",
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(pdfBytes), 
                    contentType: 'application/pdf'
                }
            ]
        });

      
        return info;

    } catch (error) {
        // console.error("Error occurred in sendMail pure: ", error.message);
        throw new Error(error.message); 
    }
}
