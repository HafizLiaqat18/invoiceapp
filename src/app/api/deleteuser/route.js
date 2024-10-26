import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import UserSchema from "@/models/userModel";

export async function DELETE(request) {
    try {
      await connect();
      const reqBody = await request.json();
      const { email } = reqBody;

 

  
      const existingUser = await UserSchema.findOne({  email });

 
  
      if (!existingUser) {
   
        return NextResponse.json(
          { error: "User with this title does not exist!", success: false },
          { status: 404 }
        );
      }
  
      // If the user exists, delete it
      await UserSchema.findOneAndDelete({email});
     
  
      return NextResponse.json(
        { message: "User deleted successfully!", success: true },
        { status: 200 }
      );
    } catch (error) {
    
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 500 }
      );
    }
  }
  