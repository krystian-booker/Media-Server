import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
import MediaLocationService from './mediaLocation';
import { IMedia, IMediaDTO } from '../interfaces/IMedia';
import { Document } from 'mongoose';

@Service()
export default class MediaService {
    constructor(@Inject('mediaModel') private mediaModel: Models.MediaModel, @Inject('logger') private logger) {}

    public async createMedia(mediaDTO: IMediaDTO): Promise<{ mediaRecord: IMedia & Document }> {
        try {
            const mediaRecord = await this.mediaModel.create({
                ...mediaDTO,
            });

            if (!mediaRecord) {
                throw new Error('Media cannot be created');
            }

            return { mediaRecord };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
