import { IMovieLocation } from '../interfaces/IMovieLocation';
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

export default mongoose.model<IMovieLocation & mongoose.Document>('MovieLocation', MovieLocation);
