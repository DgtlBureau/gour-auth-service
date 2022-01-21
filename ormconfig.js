const dotenv = require('dotenv');
dotenv.config();

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
    "type": "better-sqlite3",
    "database": process.env.DB_DATABASE,
    "synchronize": false,
    "entities": [
        PROD ? 'dist/entity/*.js' : "src/entity/*.ts"
    ],
    "subscribers": [
        PROD ? 'dist/subscriber/*.js' : "src/subscriber/*.ts"
    ],
    "migrations": [
        PROD ? 'dist/migration/*.js' : "src/migration/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}