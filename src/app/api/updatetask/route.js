import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import TaskSchema from "@/models/taskModel";

export async function PUT(request) {
  try {
    await connect();
    const reqBody = await request.json();
    const { title, description, price } = reqBody;

    console.log("update task -1")
    const updatedTask = await TaskSchema.findOneAndUpdate(
        { title },
        { description, price },
        
    );
    console.log("update task -2")

    if (!updatedTask) {
        console.log("!update task -3")
        return NextResponse.json(
            { error: "Task with this title does not exist!", success: false },
            { status: 404 }
        );
    }
    console.log("!update task -4")
    
    return NextResponse.json(
        { message: "Task updated successfully!", success: true },
        { status: 200 }
    );
} catch (error) {
      console.log("!update task -5" + error.message)
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
