import { connectDB } from "@/config/db";
import { NextResponse } from "next/server";
import {User} from "@/models/userModel";
import { comparePassword, generateJWT } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateJWT(user._id.toString());
    const res = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
