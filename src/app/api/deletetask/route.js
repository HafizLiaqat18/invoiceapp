import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import TaskSchema from "@/models/taskModel";

export async function DELETE(request) {
  try {
    await connect();
    const reqBody = await request.json();
    console.log(reqBody);
    const { _id } = reqBody;

    // Check if the task exists
    const existingTask = await TaskSchema.findOne({_id});

    if (!existingTask) {
      console.log("!update task -3");
      return NextResponse.json(
        { error: "Task with this title does not exist!", success: false },
        { status: 404 }
      );
    }

    // If the task exists, delete it
    await TaskSchema.findOneAndDelete({_id});
    console.log("!update task -4");
    
    return NextResponse.json(
      { message: "Task deleted successfully!", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("!update task -5" + error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
