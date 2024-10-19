import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function sendMail({ user, tasks }) {
    console.log("Send mail function started");

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        
        // Embed fonts
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
        
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;

        // Add colors
        const black = rgb(0, 0, 0);
        const blue = rgb(0, 0, 1);

        // Display User Name and Email at the top
        page.drawText(`User: ${user.firstName + user.lastName}`, {
            x: 50,
            y: height - 50,
            size: fontSize + 4,
            font: timesBoldFont,
            color: black,
        });
        page.drawText(`Email: ${user.email}`, {
            x: 50,
            y: height - 70,
            size: fontSize + 4,
            font: timesBoldFont,
            color: black,
        });

        // Add a title for the invoice
        page.drawText('Invoice Details', {
            x: 50,
            y: height - 100,
            size: fontSize + 6,
            font: timesBoldFont,
            color: blue,
        });

        // Add a table header with task title, description, and price
        let currentY = height - 130;
        page.drawText('Task Title', { x: 50, y: currentY, size: fontSize + 2, font: timesBoldFont });
        page.drawText('Description', { x: width / 2 - 50, y: currentY, size: fontSize + 2, font: timesBoldFont });
        page.drawText('Price', { x: width - 100, y: currentY, size: fontSize + 2, font: timesBoldFont });

        currentY -= 30;

        let total = 0;

        // Loop through tasks and display them in the table
        tasks.forEach((task, index) => {
            if (task.title && task.description && task.price) {
                page.drawText(`${index + 1}. ${task.title}`, {
                    x: 50,
                    y: currentY,
                    size: fontSize,
                    font: timesRomanFont,
                    color: black
                });
                page.drawText(task.description, {
                    x: width / 2 - 50,
                    y: currentY,
                    size: fontSize,
                    font: timesRomanFont,
                    color: black
                });
                page.drawText(`$${task.price.toFixed(2)}`, {
                    x: width - 100,
                    y: currentY,
                    size: fontSize,
                    font: timesRomanFont,
                    color: black
                });
                currentY -= 20;
                total += task.price;
            }
        });

        // Add a line separator before showing the total price
        page.drawText('--------------------------------------------', {
            x: 50,
            y: currentY - 10,
            size: fontSize,
            font: timesRomanFont,
            color: black,
        });

        // Display the total price
        page.drawText(`Total: $${total.toFixed(2)}`, {
            x: width - 100,
            y: currentY - 30,
            size: fontSize + 2,
            font: timesBoldFont,
            color: blue,
        });

        // Save PDF and generate bytes
        const pdfBytes = await pdfDoc.save();
        console.log("PDF saved");

        // Set up transporter
        let transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email with PDF attachment
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Invoice for Your Tasks",
            text: "Please find attached the invoice for your tasks.",
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(pdfBytes), // Explicitly converting to Buffer
                    contentType: 'application/pdf'
                }
            ]
        });

        console.log("Mail sent: ", info.messageId);
        return info;

    } catch (error) {
        console.error("Error occurred in sendMail: ", error.message);
        throw new Error(error.message); // Rethrow error to propagate it
    }
}
