

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { sendMail } from './sendMail';
import fs from 'fs/promises';
export async function generatePdf({ user, tasks, invoiceNumber = 2 }) {

    try {
        
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        const curvyFontBytes = await fs.readFile('/home/liaqat/Documents/Job/invoice-app/assests/fonts/tomatoes-font/Tomatoes-O8L8.ttf');
        const arialBoldFontBytes = await fs.readFile('/home/liaqat/Documents/Job/invoice-app/assests/fonts/arial-font/G_ari_bd.TTF');
        const arialLightFontBytes = await fs.readFile('/home/liaqat/Documents/Job/invoice-app/assests/fonts/arial-font/arial.ttf');
        const curvyFont = await pdfDoc.embedFont(curvyFontBytes);
        const arialBoldFont = await pdfDoc.embedFont(arialBoldFontBytes);
        const arialLightFont = await pdfDoc.embedFont(arialLightFontBytes);

        // Embed Helvetica fonts
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        // Add a page to the document
        const page = pdfDoc.addPage([595, 842]); // A4 size in points
        const { width, height } = page.getSize();
        const fontSize = 12;

        // Colors
        const black = rgb(0, 0, 0);
        const blue = rgb(0, 0, 1);
        const lightGray = rgb(0.9, 0.9, 0.9);
        const darkGray = rgb(0.4, 0.4, 0.4);

        /** HEADER SECTION */
        // Company Information
        page.drawText('East Repair Inc.', {
            x: 50,
            y: height - 50,
            size: 18,
            font: arialBoldFont,
            color: black
        });
        page.drawText('123 Main Street, City, State, ZIP', {
            x: 50,
            y: height - 70,
            size: fontSize,
            font: arialLightFont,
            color: black
        });
        page.drawText('Phone: (555) 555-5555 | Email: contact@eastrepair.com', {
            x: 50,
            y: height - 90,
            size: fontSize,
            font: arialLightFont,
            color: black
        });

        // Invoice Number and Date
        const currentDate = new Date().toLocaleDateString();
        page.drawText(`Invoice No: ${invoiceNumber}`, {
            x: width - 200,
            y: height - 50,
            size: fontSize + 2,
            font: arialBoldFont,
            color: black,
        });
        page.drawText(`Date: ${currentDate}`, {
            x: width - 200,
            y: height - 70,
            size: fontSize + 2,
            font: arialLightFont,
            color: black,
        });

        // Line separator
        page.drawText('----------------------------------------------------------------', {
            x: 50,
            y: height - 110,
            size: fontSize,
            font: helveticaFont,
            color: darkGray,
        });

        /** BODY SECTION */
        let currentY = height - 140;

        // Billing and Shipping Address
        page.drawText('BILL TO:', {
            x: 50,
            y: currentY,
            size: fontSize + 2,
            font: arialBoldFont,
            color: black
        });
        page.drawText(`${user.firstName} ${user.lastName}`, {
            x: 50,
            y: currentY - 20,
            size: fontSize,
            font: arialLightFont,
            color: black
        });
        page.drawText('123 Client Street, City, State, ZIP', {
            x: 50,
            y: currentY - 40,
            size: fontSize,
            font: arialLightFont,
            color: black
        });

        // Itemized Services Table
        currentY -= 120;
        page.drawText("Itemized List of Services", {
            x: 50,
            y: currentY,
            size: fontSize + 4,
            font: arialBoldFont,
            color: black,
        });

        // Table Headers
        currentY -= 50;
        page.drawRectangle({
            x: 50,
            y: currentY,
            width: width - 100,
            height: 30,
            color: darkGray,
        });
        page.drawText('Quantity', { x: 60, y: currentY + 10, size: fontSize + 2, font: arialBoldFont, color: rgb(1, 1, 1) });
        page.drawText('Description', { x: width / 3, y: currentY + 10, size: fontSize + 2, font: arialBoldFont, color: rgb(1, 1, 1) });
        page.drawText('Unit Price', { x: width / 1.8, y: currentY + 10, size: fontSize + 2, font: arialBoldFont, color: rgb(1, 1, 1) });
        page.drawText('Amount', { x: width - 120, y: currentY + 10, size: fontSize + 2, font: arialBoldFont, color: rgb(1, 1, 1) });

        // Table Body
        currentY -= 30;
        let total = 0;
        tasks.forEach((task, index) => {
            const { description, price } = task;

            // Alternating row colors for better readability
            const rowColor = index % 2 === 0 ? lightGray : rgb(1, 1, 1);
            page.drawRectangle({
                x: 50,
                y: currentY - 5,
                width: width - 100,
                height: 20,
                color: rowColor,
            });

            // Table data
            page.drawText(description, { x: width / 3, y: currentY, size: fontSize, font: arialLightFont, color: black });
            page.drawText(`$${price.toFixed(2)}`, { x: width - 120, y: currentY, size: fontSize, font: arialLightFont, color: black });

            currentY -= 20;
            total += price;
        });

        // Total Amount Due
        currentY -= 30;
        page.drawText('TOTAL DUE:', {
            x: width - 120,
            y: currentY,
            size: fontSize + 2,
            font: arialBoldFont,
            color: darkGray,
        });
        page.drawText(`$${total.toFixed(2)}`, {
            x: width - 120,
            y: currentY - 20,
            size: fontSize + 2,
            font: arialLightFont,
            color: darkGray,
        });

        /** FOOTER SECTION */
        currentY -= 50;
        // Signature Line
        page.drawText('Authorized Signature:', {
            x: 50,
            y: currentY - 30,
            size: fontSize + 2,
            font: arialBoldFont,
            color: black,
        });
        page.drawText('Liaqat', {
            x: 220,  // Adjust the x coordinate for better alignment
            y: currentY - 30, // Adjust position below the label
            size: 24, // Larger font size for signature look
            font: curvyFont, // Use italic font for a cursive effect
            color: black,
        });
        // Line for signature
        page.drawLine({
            start: { x: 180, y: currentY - 30 },
            end: { x: 400, y: currentY - 30 },
            thickness: 1,
            color: black
        });

     
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const res = await sendMail(user, pdfBytes);
        return res;

    } catch (error) {
        // console.error("Error occurred in sendMail: ", error.message);
        throw new Error(error.message);
    }
}



















