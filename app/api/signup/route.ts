import { connectToDatabase } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectToDatabase();
export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({message: "User already exists"},{status: 400});
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser  = new User({
            username,
            email,
            password: hashedPassword,
        })
        const savedUser = await newUser.save();
        console.log("User signed up successfully:", savedUser);

        await sendEmail({email, emailType: "Verify", userId: savedUser._id});
        return NextResponse.json({message: "User signed up successfully", success: true, savedUser}, {status: 201});
    }catch(error){
        return NextResponse.json({message: "Internal Server Error", error: error}, {status:500});
    }
}