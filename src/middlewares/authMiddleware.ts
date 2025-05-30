import { NextResponse,NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import envConfig from '@/config/env';

const {JWT_SECRET}=envConfig;
export const authenticateUser=async (req:NextRequest)=>{
 try {
    const authHeader=req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    return { userId: decoded.userId };
 } catch (error) {
        return NextResponse.json({ message: 'Invalid or expired token' , error}, { status: 401 });

 }
}