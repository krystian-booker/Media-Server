import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const MediaLocation = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter a name'],
            unique: true,
            index: true
        },

        location: {
            type: String,
            unique: true,
            index: true
        },
    },
    { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('MediaLocation', MediaLocation);
