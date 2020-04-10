import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IMediaLocations } from '../../interfaces/IMediaLocations';

declare global {
    namespace Express {

        export interface Request {
            currentUser: IUser & Document;
            currentMediaLocation: IMediaLocations & Document;
        }
    }

    namespace Models {
        export type UserModel = Model<IUser & Document>;
        export type MediaLocation = Model<IMediaLocations & Document>;
    }
}
