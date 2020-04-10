import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import mediaLocation from './routes/mediaLocation';
import media from './routes/media';

// guaranteed to get dependencies
export default () => {
    const app = Router();
    auth(app);
    user(app);
    agendash(app);
    media(app);
    mediaLocation(app);
    
    return app;
};
