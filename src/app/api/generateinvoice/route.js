import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import { sendMail } from "@/app/helpers/sendEmail";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { user, tasks } = reqBody;

        // Log request body for debugging
        console.log("Request Body: ", reqBody);

        const mailRes = await sendMail({ user, tasks });
        console.log("mailResponse ", mailRes);

        return NextResponse.json({ success: true, message: "Mail sent successfully" });

    } catch (error) {
        console.error("Error in POST handler: ", error.message);
        return NextResponse.json({ success: false, message: error.message });
    }
}
