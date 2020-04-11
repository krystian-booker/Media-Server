import { Container } from 'typedi';
import { IUser, IUserInputDTO } from '../../interfaces/IUser';
import AuthService from '../../services/auth';

export default class AuthLogic {
    public async userSignUp(userInput: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignUp(userInput);
        return { user, token };
    }

    public async userSignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignIn(email, password);
        return { user, token };
    }
}
