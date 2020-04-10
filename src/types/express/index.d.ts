import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IMediaLocation } from '../../interfaces/IMediaLocation';
import { IMedia } from '../../interfaces/IMedia';

declare global {
    namespace Express {

        export interface Request {
            currentUser: IUser & Document;
            currentMediaLocation: IMediaLocation & Document;
            currentMedia: IMedia & Document;
        }
    }

    namespace Models {
        export type UserModel = Model<IUser & Document>;
        export type MediaLocationModel = Model<IMediaLocation & Document>;
        export type MediaModel = Model<IMedia & Document>;
    }
}
