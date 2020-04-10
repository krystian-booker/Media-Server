import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const Media = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: [true, 'Please enter a name'],
            unique: false,
            index: true,
        },
        location: {
            type: String,
            required: [true, 'Please enter a file path'],
            unique: false,
            index: true,
        },
        mediaLocationName: {
            type: String,
            required: [true, 'Media needs to be attached to a media location'],
            unique: false,
            index: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('Media', Media);
