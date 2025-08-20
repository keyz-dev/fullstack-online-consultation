const logger = require('../utils/logger');
const { Sequelize }  = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV;
const config = require('./config.js')[env];
const sequelize = new Sequelize(config.url, config);

const connect_to_db = async () => {
    const MAX_RETRIES = 3
    retry_count = 0
    let success = false

    while (retry_count < MAX_RETRIES){
        try{
            await sequelize.authenticate();
            success = true
            logger.info('Connection to the database established')
            break
        }
        catch(err){
            logger.error(`Error connecting to the database : ${err}`)
            retry_count += 1
        }
    }

    if (! success){
        logger.error("Failed to connect to the database after the retries")
        process.exit(1)
    }
}

connect_to_db()
module.exports = sequelize
