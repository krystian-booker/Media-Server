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
import * as path from 'path';

@Service()
export default class MovieScannerService {
    constructor(@Inject('movieModel') private movieModel: Models.MovieModel) {}

    public async scan(mediaLocationInputDTO: IMovieLocationDTO): Promise<{ test: String }> {
        try {
            //Get movie location for document id
            const movieLocationServiceInstance = Container.get(MovieLocationService);
            var { movieLocationRecord } = await movieLocationServiceInstance.getMovieLocationByLocation(mediaLocationInputDTO.location);

            var directoryResults = await this.fileSystemScan(mediaLocationInputDTO);
            for (let directory of directoryResults.directory) {
                if (directory.isDirectory()) {
                    this.createMovieInDirectory(directory, mediaLocationInputDTO, movieLocationRecord);
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

    private async createMovieInDirectory(directory: fs.Dirent, mediaLocationInputDTO: IMovieLocationDTO, movieLocationRecord: IMovieLocation & Document) {
        var movieFolder = this.formatPath(mediaLocationInputDTO.location, directory.name);
        if (await this.doesMovieFolderExist(movieFolder)) {
            return;
        }

        var movieSubDirectory: fs.Dirent[] = await fs.readdirSync(movieFolder, { withFileTypes: true });
        for (let file of movieSubDirectory) {
            if (!file.isDirectory() && this.isFileTypeOfVideo(file)) {
                var movieFile = this.formatPath(movieFolder, file.name);
                await this.createMovieRecord(file, movieFolder, movieFile, movieLocationRecord);
            }
        }
    }

    private async createMovieWithoutDirectory(directory: fs.Dirent, mediaLocationInputDTO: IMovieLocationDTO, movieLocationRecord: IMovieLocation & Document) {
        if (this.isFileTypeOfVideo(directory)) {
            var movieFileLocation = this.formatPath(mediaLocationInputDTO.location, directory.name);
            if (await this.doesMovieFileExist(movieFileLocation)) {
                return;
            }
            await this.createMovieRecord(directory, movieFileLocation, movieFileLocation, movieLocationRecord);
        } else {
            Logger.silly(`${directory.name} is not a video file`);
        }
    }

    private async createMovieRecord(directory: fs.Dirent, folder: string, file: string, movieLocationRecord: IMovieLocation & Document) {
        var movieTitleDetails = this.parseMovieTitle(directory.name);
        var movieDTO: IMovieDTO = {
            name: movieTitleDetails.title ? movieTitleDetails.title : 'undefined',
            folder: folder ? folder : 'undefined',
            file: file ? file : 'undefined',
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

    private async doesMovieFileExist(movieFileLocation: string): Promise<boolean> {
        const movieServiceInstance = Container.get(MovieService);
        var movie = await movieServiceInstance.getMovieByFile(movieFileLocation);
        if (movie) {
            Logger.silly(`Movie record already exists: ${movieFileLocation}`);
        }
        return movie != null;
    }

    private async doesMovieFolderExist(movieFolderLocation: string): Promise<boolean> {
        const movieServiceInstance = Container.get(MovieService);
        var movie = await movieServiceInstance.getMovieByFolder(movieFolderLocation);
        if (movie) {
            Logger.silly(`Movie record already exists: ${movieFolderLocation}`);
        }
        return movie != null;
    }

    private isFileTypeOfVideo(file: fs.Dirent): boolean {
        var fileExtension = path.extname(file.name);
        //TODO: Remove unnecessary movie types
        var videoFileExtensionsRegex: RegExp = new RegExp('^(.webm|.mpg|.mp2|.mpeg|.mpe|.mpv|.ogg|.mp4|.m4p|.m4v|.avi|.wmv|.mov|.qt|.flv|.mkv|.vob|.ogv|.drc|.mts|.m2ts|.ts|.asf|.amv|.m2v|.svi)$');
        var isFileTypeOfVideo = videoFileExtensionsRegex.test(fileExtension);
        return isFileTypeOfVideo;
    }
}
