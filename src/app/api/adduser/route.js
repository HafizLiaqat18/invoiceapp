import { NextResponse } from "next/server";
import { connect } from "@/mongodbConfig/dbConnection";
import UserSchema from "@/models/userModel";

export async function POST(request){
    try{
     await   connect();
    const reqBody = await request.json();
    const {firstName,lastName,email,age,phone} = reqBody;
    console.log(reqBody)
    const findUser = await UserSchema.findOne({email});
    console.log("find User " + findUser)
    if(findUser){
        return NextResponse.json({error:"Email Already exist !",success:false},{status:409});
    }
    const createUser = new UserSchema({
        firstName,
        lastName,
        email,
        age,
        phone
    });
    await createUser.save();
    return NextResponse.json({message:"User Created Successfully!",success:true},{status:201})


}catch(error){
    return NextResponse.json({error:error.message,success:false},{status:500});
        
}

}