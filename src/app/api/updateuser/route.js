import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import UserSchema from "@/models/userModel";

export async function PUT(request) {
  try {
    await connect();
    
    const reqBody = await request.json();
    const { firstName, lastName, email, age, phone } = reqBody;

    const updateUser = await UserSchema.findOneAndUpdate(
      { email },
      { firstName, lastName, age, phone },
      { new: true }
    );

    if (!updateUser) {
      return NextResponse.json(
        { error: "User with this email does not exist!", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully!", success: true, user: updateUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
