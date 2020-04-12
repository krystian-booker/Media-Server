import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const Movie = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter a name'],
            unique: false,
            index: true,
        },
        folder: {
            type: String,
            required: [true, 'Please enter a file path'],
            unique: false,
            index: true,
        },
        file: {
            type: String,
            required: [true, 'Please enter a file path'],
            unique: false,
            index: true,
        },
        movieLocationId: {
            type: String,
            required: [true, 'Movie must be attached to a location'],
            unique: false,
            index: false
        }
    },
    { timestamps: true }
);

export default mongoose.model<IUser & mongoose.Document>('Movie', Movie);
