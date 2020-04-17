import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import Logger from '../loaders/logger';

@Service()
export default class AuthService {
    constructor(@Inject('userModel') private userModel: Models.UserModel, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {}

    public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        try {
            const salt = randomBytes(32);

            Logger.silly('Hashing password');
            const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
            Logger.silly('Creating user db record');
            const userRecord = await this.userModel.create({
                ...userInputDTO,
                salt: salt.toString('hex'),
                password: hashedPassword
            });
            Logger.silly('Generating JWT');
            const token = this.generateToken(userRecord);

            if (!userRecord) {
                throw new Error('User cannot be created');
            }
            this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');
            return { user, token };
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }

    public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const userRecord = await this.userModel.findOne({ email });
        if (!userRecord) {
            throw new Error('User not registered');
        }

        /**
         * We use verify from argon2 to prevent 'timing based' attacks
         */
        Logger.silly('Checking password');
        const validPassword = await argon2.verify(userRecord.password, password);
        if (validPassword) {
            Logger.silly('Password is valid!');
            Logger.silly('Generating JWT');
            const token = this.generateToken(userRecord);

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');
            return { user, token };
        } else {
            throw new Error('Invalid Password');
        }
    }

    private generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        Logger.silly(`Sign JWT for userId: ${user._id}`);
        return jwt.sign(
            {
                _id: user._id,
                role: user.role,
                name: user.name,
                exp: exp.getTime() / 1000
            },
            config.jwtSecret
        );
    }
}
