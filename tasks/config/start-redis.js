var exec = require('child_process').exec;

module.exports = function(gulp, plugins, growl) {
    gulp.task('startRedis', function () {
        exec('redis-2.8.15/src/redis-server', function (err, stdout, stderr) {
            if (err) {
                console.log(err, stdout, stderr);
            }
        });
    });
}