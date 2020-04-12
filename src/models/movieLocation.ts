import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const MovieLocation = new mongoose.Schema(
    {
        location: {
            type: String,
            unique: true,
            index: true
        },
    },
    { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('MovieLocation', MovieLocation);
