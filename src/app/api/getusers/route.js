import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import UserSchema from "@/models/userModel";
connect();

export async function GET(){
    try{

        const getUsers = await UserSchema.find();
       return NextResponse.json({data:getUsers,succss:true},{status:200});

}catch(error){
    return NextResponse.json({error:error.message,success:false},{status:500});
        
}

}