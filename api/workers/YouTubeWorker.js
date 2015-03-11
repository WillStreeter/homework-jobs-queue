/**
 * @description a worker to perform google api search of youtube videos by topics
 * @type {Object}
 */
var async = require('async');
var request = require("request");
module.exports = {
    //worker concurrency
    concurrency: 2,
    perform: function(job, done, context) {
        var ytQueryURL = job.data.ytQueryURL;
        var ytTopics   = job.data.ytTopics;

        //update sails model
        async
            .waterfall(
            [

                function(cb) {
                    request.get({
                        url: ytQueryURL
                    }, function(err, res, body) {
                        if(err) {
                            return cb(err);
                        }
                        var ytModeldata = { yt_topics:ytTopics, yt_videos:body};
                        cb(null, ytModeldata);
                    });
                },
                function(ytModeldata, cb) {
                    YouTubeTopic.create(ytModeldata).exec(function(err, ytResult) {

                        if (err) {return res.serverError(err);}
                        cb(null, ytResult)

                    });

                }
            ],
            function(error, ytResult) {
                if (error) {
                    done(error);
                } else {
                    done(null, ytResult);
                }
            });
    }

};