import { Container } from 'typedi';
import MovieService from '../../services/movie';
import { IMovie, IMovieDTO } from '../../interfaces/IMovie';

export default class MovieLogic {
    public async createMovie(movieDTO: IMovieDTO): Promise<{ movie: IMovie }> {
        const movieServiceInstance = Container.get(MovieService);
        const { movieRecord } = await movieServiceInstance.createMedia(movieDTO);

        var movie = movieRecord.toObject();
        return movie;
    }
}
