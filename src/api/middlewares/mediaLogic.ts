import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
import MediaLocationService from '../../services/mediaLocation';
import MediaService from '../../services/media';
import { IMedia, IMediaDTO } from '../../interfaces/IMedia';
import Logger from '../../loaders/logger';

export default class MediaLogic {
    constructor() {}

    public async createMedia(mediaDTO: IMediaDTO): Promise<{ media: IMedia }> {
        Logger.silly('Checking if media location db record exists');
        const mediaLocationServiceInstance = Container.get(MediaLocationService);
        const { mediaLocation } = await mediaLocationServiceInstance.getMediaByName(mediaDTO.mediaLocationName);

        if (!mediaLocation) {
            throw new Error('Media cannot be created without a media location');
        }

        Logger.silly('Creating media db record');
        const mediaServiceInstance = Container.get(MediaService);
        const { mediaRecord } = await mediaServiceInstance.createMedia(mediaDTO);

        var media = mediaRecord.toObject();
        return media;
    }
}
