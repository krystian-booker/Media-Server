import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import Logger from '../../loaders/logger';
import { IMovieLocationDTO } from '../../interfaces/IMovieLocation';
const route = Router();
const movieLocationLogic = new middlewares.movieLocationLogic();

export default (app: Router) => {
    app.use('/media', route);

    route.post(
        '/movieLocation',
        middlewares.isUserAuthorized,
        celebrate({
            body: Joi.object({
                location: Joi.string().required(),
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            Logger.debug('Calling Movie-Location creation endpoint with body: %o', req.body);
            try {
                const movieLocation = await movieLocationLogic.createMovieLocation(req.body as IMovieLocationDTO);
                return res.status(201).json({ movieLocation });
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
        }
    );

    route.get('/movieLocation', middlewares.isUserAuthorized, async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Calling Movie-Location get endpoint with body: %o', req.body);
        try {
            const movieLocations = await movieLocationLogic.getAllMovieLocations();
            return res.json({ movieLocations: movieLocations }).status(200);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    });
};
