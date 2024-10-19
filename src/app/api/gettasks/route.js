import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import TasksSchema from "@/models/taskModel";
connect();

export async function GET(){
    try{

        const getTasks = await TasksSchema.find();
       return NextResponse.json({data:getTasks,succss:true},{status:200});

}catch(error){
    return NextResponse.json({error:error.message,success:false},{status:500});
        
}

}