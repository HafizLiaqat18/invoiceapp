import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import AdminModel from "@/models/adminModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export async function POST(request) {
    try {
        await connect();
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const findAdmin = await AdminModel.findOne({ email });
        if (!findAdmin) {
            return NextResponse.json({ success: false, message: "Invalid Credentials" }, { status: 401 });
        }

        const result = await bcrypt.compare(password, findAdmin.password);
        if (!result) {
            return NextResponse.json({ success: false, message: "Invalid Credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            { username: findAdmin.username, email: findAdmin.email, _id: findAdmin._id },
            process.env.JWT_TOKEN,
            { expiresIn: "2h" }
        );

        const response = NextResponse.json({ message: "User Login Successfully!", success: true }, { status: 200 });
        response.cookies.set("token", token, { httpOnly: true, expires: new Date(Date.now() + 2 * 60 * 60 * 1000) });
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    }
}
