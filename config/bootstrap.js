/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  //cb();
    var redisLab = require('../config/redisLab.js');
    sails.hooks.publisher.queue
        .on('job complete', function(id, result) {
            var kue = require('kue');
            kue.Job.get(id, function(err, job){
                if (err) return;
                job.remove(function(err){
                    if (err) throw err;
                    console.log('removed completed job #%d', job.id);
                    sails.sockets.blast('followingjobs', {event:'jobsevent',type:'completed', jobId:job.id});
                });
            });
        })
        .on('job enqueue', function(id,type){
            sails.sockets.blast('followingjobs', {event:'jobsevent', type:'enqueue', jobId:id});
            console.log( 'job %s got queued', id );
        })
        .on('job failed', function(id, type){
            sails.sockets.blast('followingjobs', {event:'jobsevent', type:'failed', jobId:id});
        });

    cb();
};
