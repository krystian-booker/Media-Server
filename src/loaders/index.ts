import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered
import './events';

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    Logger.info('DB loaded and connected!');

    const userModel = {
        name: 'userModel',
        model: require('../models/user').default,
    };

    const mediaLocationsModel = {
        name: 'mediaLocationsModel',
        model: require('../models/mediaLocations').default
    }

    const { agenda } = await dependencyInjectorLoader({
        mongoConnection,
        models: [
            userModel,
            mediaLocationsModel
        ]
    });
    Logger.info('Dependency Injector loaded');

    await jobsLoader({ agenda });
    Logger.info('Jobs loaded');

    await expressLoader({ app: expressApp });
    Logger.info('Express loaded');
};
