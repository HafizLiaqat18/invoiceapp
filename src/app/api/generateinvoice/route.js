import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import { generatePdf } from "@/app/helpers/generatePdf";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { user, tasks } = reqBody;

        await generatePdf({ user, tasks });
       

        return NextResponse.json({ success: true, message: "Mail sent successfully" });

    } catch (error) {
        // console.error("Error in POST handler: ", error.message);
        return NextResponse.json({ success: false, message: error.message });
    }
}
