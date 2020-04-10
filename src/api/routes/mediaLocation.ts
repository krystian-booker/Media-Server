import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import MediaLocationService from '../../services/mediaLocation';
import { celebrate, Joi } from 'celebrate';
import Logger from '../../loaders/logger';
import { IMediaLocationDTO } from '../../interfaces/IMediaLocation';
const route = Router();

export default (app: Router) => {
    app.use('/media', route);

    route.post(
        '/mediaLocation',
        middlewares.isAuth,
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                location: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            Logger.debug('Calling Media-Location creation endpoint with body: %o', req.body);
            try {
                const mediaLocationServiceInstance = Container.get(MediaLocationService);
                const { mediaLocation } = await mediaLocationServiceInstance.createMediaLocation(
                    req.body as IMediaLocationDTO,
                );

                return res.status(201).json({ mediaLocation });
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
        },
    );

    route.get('/mediaLocation', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Calling Media-Location get endpoint with body: %o', req.body);
        try {
            const mediaLocationServiceInstance = Container.get(MediaLocationService);
            const { mediaLocations } = await mediaLocationServiceInstance.getMediaLocations();

            return res.json({ mediaLocations: mediaLocations }).status(200);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    });
};
