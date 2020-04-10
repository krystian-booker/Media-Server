import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import Logger from '../../loaders/logger';
// import MediaService from '../../services/media';
import { IMediaDTO } from '../../interfaces/IMedia';
const route = Router();

export default (app: Router) => {
    app.use('/media', route);

    route.post(
        '/content',
        middlewares.isAuth,
        celebrate({
            body: Joi.object({
                filename: Joi.string().required(),
                location: Joi.string().required(),
                mediaLocationName: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            Logger.debug('Calling media creation endpoint with body: %o', req.body);
            try {
                const mediaLogic = new middlewares.mediaLogic();
                const media = await mediaLogic.createMedia(req.body as IMediaDTO);

                return res.status(201).json({ media });
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
        },
    );
};
