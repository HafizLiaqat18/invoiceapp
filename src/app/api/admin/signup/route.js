import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import AdminModel from "@/models/adminModel";
import bcrypt from "bcrypt"


export async function POST(request) {
    try {
        await connect();
        // console.log("Database connected");

        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        // console.log("Request body:", reqBody);

        const findAdmin = await AdminModel.findOne({ email });
        if (findAdmin) {
            // console.log("Email already exists");
            return NextResponse.json({ success: false, message: "Email already exists" }, { status: 409 });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newAdmin = new AdminModel({
            username, // Include username in the model
            email,
            password: hash
        });

        await newAdmin.save();
        // console.log("User created successfully");

        return NextResponse.json({ message: "User Created Successfully!", success: true }, { status: 201 });

    } catch (error) {
        // console.error("Error:", error); // Consider logging the full error for debugging
        return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    }
}
