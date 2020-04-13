import { Service, Inject } from 'typedi';
import { IMovieLocationDTO, IMovieLocation } from '../interfaces/IMovieLocation';
import { filenameParse, ParsedFilename } from '@ctrl/video-filename-parser';
import { Container } from 'typedi';
import MovieService from './movie';
import MovieLocationService from './movieLocation';
import * as fs from 'fs';
import { IMovieDTO, IMovie } from '../interfaces/IMovie';
import Logger from '../loaders/logger';
import { Document } from 'mongoose';

const movieServiceInstance = Container.get(MovieService);
const movieLocationServiceInstance = Container.get(MovieLocationService);

@Service()
export default class MovieScannerService {
    public async scan(mediaLocationInputDTO: IMovieLocationDTO): Promise<{ test: String }> {
        try {
            //Get movie location for document id
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

    private async fileSystemScan(mediaLocationInputDTO: IMovieLocationDTO): Promise<{ directory: fs.Dirent[] }> {
        var directory: fs.Dirent[] = await fs.readdirSync(mediaLocationInputDTO.location, { withFileTypes: true });
        return { directory };
    }

    private async createMovieWithoutDirectory(directory: fs.Dirent, mediaLocationInputDTO: IMovieLocationDTO, movieLocationRecord: IMovieLocation & Document) {
        var movieFileLocation = `${mediaLocationInputDTO.location}\\${directory.name}`;
        var movie = await movieServiceInstance.getMovieByFile(movieFileLocation);
        if (movie) {
            Logger.silly('Movie record already exists');
            return;
        }

        var titleDetails: ParsedFilename = filenameParse(directory.name, false);
        if (!titleDetails) {
            Logger.error(`Error parsing file: ${directory.name}`);
            return;
        }

        var movieDTO: IMovieDTO = {
            name: titleDetails.title ? titleDetails.title : 'undefined',
            folder: mediaLocationInputDTO.location ? mediaLocationInputDTO.location : 'undefined',
            file: movieFileLocation ? movieFileLocation : 'undefined',
            movieLocationId: movieLocationRecord.id,
            year: titleDetails.year ? titleDetails.year : '0000',
        };
        await movieServiceInstance.createMovie(movieDTO);
    }
}