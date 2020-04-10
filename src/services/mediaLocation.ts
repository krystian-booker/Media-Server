import { Service, Inject } from 'typedi';
import { IMediaLocation, IMediaLocationDTO } from '../interfaces/IMediaLocation';

@Service()
export default class MediaLocationService {
    constructor(
        @Inject('mediaLocationModel') private mediaLocationModel: Models.MediaLocationModel,
        @Inject('logger') private logger,
    ) {}

    public async createMediaLocation(
        mediaLocationInputDTO: IMediaLocationDTO,
    ): Promise<{ mediaLocation: IMediaLocation }> {
        try {
            this.logger.silly('Creating media location db record');
            const mediaLocationRecord = await this.mediaLocationModel.create({
                ...mediaLocationInputDTO,
            });

            if (!mediaLocationRecord) {
                throw new Error('Media location cannot be created');
            }

            const mediaLocation = mediaLocationRecord.toObject();
            return { mediaLocation };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async getMediaLocations(): Promise<{ mediaLocations: IMediaLocation[] }> {
        const mediaLocationCursor = await this.mediaLocationModel.find().cursor();
        if (!mediaLocationCursor) {
            throw new Error('Media locations not found');
        }

        var mediaLocations: IMediaLocation[] = [];
        for (
            let mediaLocation = await mediaLocationCursor.next();
            mediaLocation != null;
            mediaLocation = await mediaLocationCursor.next()
        ) {
            mediaLocations.push(mediaLocation.toObject());
        }
        return { mediaLocations };
    }

    public async getMediaByName(name: string): Promise<{ mediaLocation: IMediaLocation }> {
        const mediaLocationRecord = await this.mediaLocationModel.findOne({ name });
        if (!mediaLocationRecord) {
            throw new Error('Media locations not found');
        }

        const mediaLocation = mediaLocationRecord.toObject();
        return { mediaLocation };
    }
}
