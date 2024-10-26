import mongoose from "mongoose";

export async function connect() {

    console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_TOKEN:", process.env.JWT_TOKEN);

    if (mongoose.connections[0].readyState) {
        console.log("Already connected to the database.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the database.");
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Database connection failed");
    }
}
