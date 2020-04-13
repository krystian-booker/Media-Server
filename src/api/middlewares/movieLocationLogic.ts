import { Container } from 'typedi';
import MovieLocationService from '../../services/movieLocation';
import { IMovieLocation, IMovieLocationDTO } from '../../interfaces/IMovieLocation';

export default class MovieLocationLogic {
    public async createMovieLocation(movieLocationDTO: IMovieLocationDTO): Promise<{ movieLocation: IMovieLocation }> {
        const movieLocationServiceInstance = Container.get(MovieLocationService);
        const { movieLocationRecord } = await movieLocationServiceInstance.createMovieLocation(movieLocationDTO);

        var movieLocation = movieLocationRecord.toObject();
        return movieLocation;
    }

    public async getAllMovieLocations(): Promise<{ movieLocations: IMovieLocation[] }> {
        const movieLocationServiceInstance = Container.get(MovieLocationService);
        const { movieLocationRecords } = await movieLocationServiceInstance.getMovieLocations();

        var movieLocations: IMovieLocation[] = [];
        for (let record of movieLocationRecords) {
            movieLocations.push(record.toObject());
        }
        return { movieLocations };
    }
}
