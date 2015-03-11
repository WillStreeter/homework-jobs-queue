
var redisLab = require('../config/redisLab.js');
module.exports.subscriber = {
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
    //to wait for workers to
    //finish their current active job(s)
    //before shutdown
    shutdownDelay: 6000,
    //number of millisecond to
    //wait until promoting delayed jobs
    promotionDelay: 6000,
    //number of delated jobs
    //to be promoted
    promotionLimit: 300
}