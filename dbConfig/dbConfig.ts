import mongoose from "mongoose"

export async function connectToDatabase(){
    try{
        await mongoose.connect(process.env.MONGODB_URI!)
    }catch(error){
        console.log("db connection failed", error)
    }
}