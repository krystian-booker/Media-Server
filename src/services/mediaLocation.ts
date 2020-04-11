import { Service, Inject } from 'typedi';
import { IMediaLocation, IMediaLocationDTO } from '../interfaces/IMediaLocation';
import { Document } from 'mongoose';

@Service()
export default class MediaLocationService {
    constructor(@Inject('mediaLocationModel') private mediaLocationModel: Models.MediaLocationModel, @Inject('logger') private logger) {}

    public async createMediaLocation(mediaLocationInputDTO: IMediaLocationDTO): Promise<{ mediaLocationRecord: IMediaLocation & Document }> {
        try {
            const mediaLocationRecord = await this.mediaLocationModel.create({
                ...mediaLocationInputDTO
            });

            if (!mediaLocationRecord) {
                throw new Error('Media location cannot be created');
            }

            return { mediaLocationRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async getMediaLocations(): Promise<{ mediaLocationRecords: (IMediaLocation & Document)[] }> {
        const mediaLocationRecords = await this.mediaLocationModel.find();
        if (!mediaLocationRecords) {
            throw new Error('Media locations not found');
        }

        return { mediaLocationRecords };
    }

    public async getMediaByName(name: string): Promise<{ mediaLocationRecord: IMediaLocation & Document }> {
        const mediaLocationRecord = await this.mediaLocationModel.findOne({ name });
        if (!mediaLocationRecord) {
            throw new Error('Media locations not found');
        }
        return { mediaLocationRecord };
    }
}
