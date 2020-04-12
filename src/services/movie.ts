import { Service, Inject } from 'typedi';
import { IMovie, IMovieDTO } from '../interfaces/IMovie';
import { Document } from 'mongoose';

@Service()
export default class MovieService {
    constructor(@Inject('movieModel') private mediaModel: Models.MovieModel, @Inject('logger') private logger) {}

    public async createMedia(movieDTO: IMovieDTO): Promise<{ movieRecord: IMovie & Document }> {
        try {
            const movieRecord = await this.mediaModel.create({
                ...movieDTO,
            });

            if (!movieRecord) {
                throw new Error('Media cannot be created');
            }

            return { movieRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
