var local = require('../config/local.js');
module.exports.redisLab = {
    host          : local.redisLab.host,
    port          : local.redisLab.port,
    database      : local.redisLab.database,
    auth          : local.redisLab.password

};