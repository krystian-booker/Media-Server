import { Service, Inject } from 'typedi';
import { IMovie, IMovieDTO } from '../interfaces/IMovie';
import { Document } from 'mongoose';
import Logger from '../loaders/logger';

@Service()
export default class MovieService {
    constructor(@Inject('movieModel') private movieModel: Models.MovieModel, @Inject('logger') private logger) {}

    public async createMovie(movieDTO: IMovieDTO): Promise<{ movieRecord: IMovie & Document }> {
        try {
            const movieRecord = await this.movieModel.create({
                ...movieDTO,
            });

            if (!movieRecord) {
                throw new Error('Movie cannot be created');
            }

            return { movieRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async getMovieByFile(fileName: string): Promise<{ movie: IMovie }> {
        try {
            const movieRecord = await this.movieModel.findOne({ fileName });

            if (!movieRecord) {
                Logger.silly('Movie record not found');
                return null;
            }

            var movie = movieRecord.toObject();
            return { movie };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}