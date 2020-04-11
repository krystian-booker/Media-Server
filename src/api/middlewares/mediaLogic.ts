import { Container } from 'typedi';
import MediaLocationService from '../../services/mediaLocation';
import MediaService from '../../services/media';
import { IMedia, IMediaDTO } from '../../interfaces/IMedia';

export default class MediaLogic {

    public async createMedia(mediaDTO: IMediaDTO): Promise<{ media: IMedia }> {
        const mediaLocationServiceInstance = Container.get(MediaLocationService);
        const { mediaLocationRecord } = await mediaLocationServiceInstance.getMediaByName(mediaDTO.mediaLocationName);

        if (!mediaLocationRecord) {
            throw new Error('Media cannot be created without a media location');
        }

        const mediaServiceInstance = Container.get(MediaService);
        const { mediaRecord } = await mediaServiceInstance.createMedia(mediaDTO);

        var media = mediaRecord.toObject();
        return media;
    }
}
