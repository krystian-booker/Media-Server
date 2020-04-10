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

    const mediaLocationModel = {
        name: 'mediaLocationModel',
        model: require('../models/mediaLocation').default
    }

    const mediaModel = {
        name: 'mediaModel',
        model: require('../models/media').default
    }

    const { agenda } = await dependencyInjectorLoader({
        mongoConnection,
        models: [
            userModel,
            mediaLocationModel,
            mediaModel],
    });
    Logger.info('Dependency Injector loaded');

    await jobsLoader({ agenda });
    Logger.info('Jobs loaded');

    await expressLoader({ app: expressApp });
    Logger.info('Express loaded');
};
