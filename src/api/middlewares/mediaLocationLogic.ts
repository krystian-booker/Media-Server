import { Container } from 'typedi';
import MediaLocationService from '../../services/mediaLocation';
import { IMediaLocation, IMediaLocationDTO } from '../../interfaces/IMediaLocation';

export default class MediaLocationLogic {
    public async createMediaLocation(mediaLocationDTO: IMediaLocationDTO): Promise<{ mediaLocation: IMediaLocation }> {
        const mediaLocationServiceInstance = Container.get(MediaLocationService);
        const { mediaLocationRecord } = await mediaLocationServiceInstance.createMediaLocation(mediaLocationDTO);

        var mediaLocation = mediaLocationRecord.toObject();
        return mediaLocation;
    }

    public async getAllMediaLocations(): Promise<{ mediaLocations: IMediaLocation[] }> {
        const mediaLocationServiceInstance = Container.get(MediaLocationService);
        const { mediaLocationRecords } = await mediaLocationServiceInstance.getMediaLocations();

        var mediaLocations: IMediaLocation[] = [];
        for (let record of mediaLocationRecords) {
            mediaLocations.push(record.toObject());
        }
        return { mediaLocations };
    }
}
