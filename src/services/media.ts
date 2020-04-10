import { Service, Inject } from 'typedi';
import { IMediaLocations, IMediaLocationsDTO } from '../interfaces/IMediaLocations';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class MediaService {
    constructor(
        @Inject('mediaLocationsModel') private mediaLocationModel: Models.MediaLocation,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async createMediaLocation(
        mediaLocationInputDTO: IMediaLocationsDTO,
    ): Promise<{ mediaLocation: IMediaLocations }> {
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

    public async getMediaLocations(): Promise<{ mediaLocations: IMediaLocations[] }> {
        const mediaLocationCursor = await this.mediaLocationModel.find().cursor();
        if (!mediaLocationCursor) {
            throw new Error('Media locations not found');
        }

        var mediaLocations: IMediaLocations[] = [];
        for (
            let mediaLocation = await mediaLocationCursor.next();
            mediaLocation != null;
            mediaLocation = await mediaLocationCursor.next()
        ) {
            mediaLocations.push(mediaLocation.toObject());
        }
        return { mediaLocations };
    }
}
