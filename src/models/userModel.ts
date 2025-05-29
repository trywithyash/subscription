import mongoose from "mongoose";


export interface IUser extends Document {
    email: string;
    password: string;
}

const userSchema=new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});


const User= mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
