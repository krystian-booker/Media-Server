import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IMovieLocation } from '../../interfaces/IMovieLocation';
import { IMovie } from '../../interfaces/IMovie';

declare global {
    namespace Express {

        export interface Request {
            currentUser: IUser & Document;
            currentmovieLocation: IMovieLocation & Document;
            currentMovies: IMovie & Document;
        }
    }

    namespace Models {
        export type UserModel = Model<IUser & Document>;
        export type movieLocationModel = Model<IMovieLocation & Document>;
        export type MovieModel = Model<IMovie & Document>;
    }
}
