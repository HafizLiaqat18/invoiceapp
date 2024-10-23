import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import UserSchema from "@/models/userModel";

export async function DELETE(request) {
    try {
      await connect();
      const reqBody = await request.json();
      const { id } = reqBody;
  
      const existingUser = await UserSchema.findOne({ id });
      console.log(existingUser)
  
      if (!existingUser) {
        console.log("!delete task -3");
        return NextResponse.json(
          { error: "User with this title does not exist!", success: false },
          { status: 404 }
        );
      }
  
      // If the user exists, delete it
      await UserSchema.findOneAndDelete({ id });
      console.log("!delete task -4");
  
      return NextResponse.json(
        { message: "User deleted successfully!", success: true },
        { status: 200 }
      );
    } catch (error) {
      console.log("!delete task -5" + error.message);
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 500 }
      );
    }
  }
  