import { hashPassword } from "@/utils/auth";
import { NextResponse } from "next/server";
import User from '@/models/userModel';
import { connectDB } from "@/config/db";


export async function POST(req:Request){
    try {
        const {email,password}=await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }
     const hashed = await hashPassword(password);
    const newUser = await User.create({ email, password: hashed });

    return NextResponse.json({ message: 'User created', userId: newUser._id }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}