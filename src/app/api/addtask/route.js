import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import TaskSchema from "@/models/taskModel";

export async function POST(request){
    try{
       await connect();
    const reqBody = await request.json();
    const {title,description,price} = reqBody;
  
    const findTask = await TaskSchema.findOne({title});
 
    if(findTask){
        return NextResponse.json({error:"Task with this title  Already exist !",success:false},{status:409});
    }
    const createTask = new TaskSchema({
        title,
        description,
        price
    });
    await createTask.save();
    return NextResponse.json({message:"Task added Successfully!",success:true},{status:201})


}catch(error){
    return NextResponse.json({error:error.message,success:false},{status:500});
        
}

}