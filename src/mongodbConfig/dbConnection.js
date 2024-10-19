import mongoose from "mongoose";

export const connect = async ()=>{
    try{

        mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;
        connection.on("connected",()=>{
            console.log("MongoDb connected Successfully!");
        })
        connection.on("error",(err)=>{
            console.log("Connection Error : "+ err)
        })
    }catch(error){
        console.log("Something went wrong!");
        console.log("Catch Error : " + error.message);
    }
}

connect();