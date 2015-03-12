/**
 * TvController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var local_config = require("../../config/local.js");

var publisher    = sails.hooks.publisher;
var kue          = require('kue');
module.exports = {

    findTubeTopic: function(req, res){
         if(!req.query.srchPrms)
             return res.json({ error: 'must include param  | srchPrms |' }, null, 400);
            console.log('findTubeTopic =|'+req.query.srchPrms+'|');
            var YouTubeJob = null;
            YouTubeTopic.find({ where: { yt_topics: req.query.srchPrms},limit:1 }).exec(function (err, YTT) {
             if (err) return res.json({ error: err.message }, null, 500);
             if (YTT && YTT.length==0){
                YouTubeJob =  publisher.create('youtube',
                     { ytQueryURL:"https://www.googleapis.com/youtube/v3/search?part=id&q="+req.query.srchPrms+"&type=video&key="+ local_config.googleapi.myKey,
                         ytTopics:req.query.srchPrms}
                 ).delay(60000).priority('high');

                 YouTubeJob.save(function (err) {
                     if (err) {
                         return res.json({ error: err.message }, null, 500);
                     }
                     else {
                         return  res.json({ message: 'job created', id: YouTubeJob.id, ytTopic:req.query.srchPrms});
                     }
                 });


             }else{
               return  res.json({ message:'previously cataloged', videos:YTT[0].yt_videos });
             }
         });

    },

    getTopicState: function(req, res){
        if(!req.query.jobId)
            return res.json({ error: 'must include param  | jobId |' }, null, 400);

        kue.Job.get(req.query.jobId, function(err, job) {
            if (err) {
                return res.json({ error: err.message }, null, 500);
            }
            else {
                return res.json( { id:job.id, jobState:job._state} );
            }
        });
    },

    followJobs: function (req, res) {

        if (req.isSocket === true) {
            sails.sockets.join(req.socket, 'followingjobs');
            return res.send(200, 'joined');
        }

        return res.send(200);

    }

};
