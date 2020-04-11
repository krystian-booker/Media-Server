import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    // This error should crash whole process

    throw new Error("Couldn't find .env file");
}

export default {
    port: parseInt(process.env.PORT, 10),
    
    databaseURL: process.env.MONGODB_URI,

    jwtSecret: process.env.JWT_SECRET,

    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    api: {
        prefix: '/api',
    },

    /**
     * Agenda.js stuff
     */
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
    },
};
