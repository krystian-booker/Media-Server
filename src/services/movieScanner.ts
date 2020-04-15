import { Service, Inject } from 'typedi';
import { IMovieLocationDTO, IMovieLocation } from '../interfaces/IMovieLocation';
import { filenameParse, ParsedFilename } from '@ctrl/video-filename-parser';
import { Container } from 'typedi';
import MovieService from './movie';
import MovieLocationService from './movieLocation';
import { IMovieDTO } from '../interfaces/IMovie';
import Logger from '../loaders/logger';
import { Document } from 'mongoose';
import * as fs from 'fs';

@Service()
export default class MovieScannerService {
    constructor(@Inject('movieModel') private movieModel: Models.MovieModel) {}

    public async scan(mediaLocationInputDTO: IMovieLocationDTO): Promise<{ test: String }> {
        try {
            //Get movie location for document id
            const movieLocationServiceInstance = Container.get(MovieLocationService);
            var { movieLocationRecord } = await movieLocationServiceInstance.getMovieLocationByLocation(mediaLocationInputDTO.location);
            if (!movieLocationRecord) {
                Logger.error(`Movie location record was not found: ${mediaLocationInputDTO.location}`);
            }

            var directoryResults = await this.fileSystemScan(mediaLocationInputDTO);
            for (let directory of directoryResults.directory) {
                if (directory.isDirectory()) {
                    Logger.debug('TODO: implement directory search');
                } else {
                    this.createMovieWithoutDirectory(directory, mediaLocationInputDTO, movieLocationRecord);
                }
            }

            var test: string = 'hello world';
            return { test };
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }

    private async createMovieWithoutDirectory(directory: fs.Dirent, mediaLocationInputDTO: IMovieLocationDTO, movieLocationRecord: IMovieLocation & Document) {
        var movieFileLocation = this.formatPath(mediaLocationInputDTO.location, directory.name);
        if (await this.doesMovieRecordExist(movieFileLocation)) {
            return;
        }

        var movieTitleDetails = this.parseMovieTitle(directory.name);
        var movieDTO: IMovieDTO = {
            name: movieTitleDetails.title ? movieTitleDetails.title : 'undefined',
            folder: mediaLocationInputDTO.location ? mediaLocationInputDTO.location : 'undefined',
            file: movieFileLocation ? movieFileLocation : 'undefined',
            movieLocationId: movieLocationRecord.id,
            year: movieTitleDetails.year ? movieTitleDetails.year : '0000',
        };

        const movieServiceInstance = Container.get(MovieService);
        await movieServiceInstance.createMovie(movieDTO);
    }

    private parseMovieTitle(movieTitle: string): ParsedFilename {
        var titleDetails: ParsedFilename = filenameParse(movieTitle, false);
        if (!titleDetails) {
            Logger.error(`Error parsing file: ${movieTitle}`);
            return;
        }
        return titleDetails;
    }

    private async fileSystemScan(mediaLocationInputDTO: IMovieLocationDTO): Promise<{ directory: fs.Dirent[] }> {
        var directory: fs.Dirent[] = await fs.readdirSync(mediaLocationInputDTO.location, { withFileTypes: true });
        return { directory };
    }

    private formatPath(location: string, name: string): string {
        //TODO: Linux/OSX support
        return `${location}\\${name}`;
    }

    private async doesMovieRecordExist(movieFileLocation: string): Promise<boolean> {
        const movieServiceInstance = Container.get(MovieService);
        var movie = await movieServiceInstance.getMovieByFile(movieFileLocation);
        if (movie) {
            Logger.silly('Movie record already exists');
        }
        return movie != null;
    }
}
