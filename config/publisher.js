
var redisLab = require('../config/redisLab.js');

module.exports.publisher = {
    //default key prefix for kue in
    //redis server
    prefix: 'q',

    //default redis configuration
    redis: {
        port: redisLab.port,
        host: redisLab.host,
        auth: redisLab.auth
    },
    //number of milliseconds
    //to wait
    //before shutdown publisher
    shutdownDelay: 5000
}