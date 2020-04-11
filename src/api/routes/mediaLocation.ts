import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import Logger from '../../loaders/logger';
import { IMediaLocationDTO } from '../../interfaces/IMediaLocation';
const route = Router();
const mediaLocationLogic = new middlewares.mediaLocationLogic();

export default (app: Router) => {
    app.use('/media', route);

    route.post(
        '/mediaLocation',
        middlewares.isUserAuthorized,
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                location: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            Logger.debug('Calling Media-Location creation endpoint with body: %o', req.body);
            try {
                const mediaLocation = await mediaLocationLogic.createMediaLocation(req.body as IMediaLocationDTO);
                return res.status(201).json({ mediaLocation });
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
        }
    );

    route.get('/mediaLocation', middlewares.isUserAuthorized, async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Calling Media-Location get endpoint with body: %o', req.body);
        try {
            const mediaLocations = await mediaLocationLogic.getAllMediaLocations();
            return res.json({ mediaLocations: mediaLocations }).status(200);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    });
};
