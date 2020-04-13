import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import Logger from '../../loaders/logger';
import { IMovieDTO } from '../../interfaces/IMovie';
const route = Router();
const movieLogic = new middlewares.movieLogic();

//REMOVE
import { Container } from 'typedi';
import MovieService from '../../services/movieScanner';
import MovieScannerService from '../../services/movieScanner';
import { IMovieLocationDTO } from '../../interfaces/IMovieLocation';

export default (app: Router) => {
    app.use('/media', route);

    route.post(
        '/movies',
        middlewares.isUserAuthorized,
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                folder: Joi.string().required(),
                file: Joi.string().required(),
                movieLocationId: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            Logger.debug('Calling media creation endpoint with body: %o', req.body);
            try {
                const movie = await movieLogic.createMovie(req.body as IMovieDTO);

                return res.status(201).json({ movie });
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
        }
    );

    //REMOVE
    route.get('/scan', async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Calling movie scanner');
        try {
            const movieScannerServiceInstance = Container.get(MovieScannerService);
            const { test } = await movieScannerServiceInstance.scan(req.body as IMovieLocationDTO)

            return res.status(201).json({ test });
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    });
};
