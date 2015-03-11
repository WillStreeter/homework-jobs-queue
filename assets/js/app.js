var app = angular.module("JobQueueApp", ['ngSails','ui.bootstrap']);


app.controller("JobQueueController", ['$scope', '$sails', '$log', '$http', '$timeout', '$filter','$modal',
    function ($scope, $sails, $log, $http, $timeout, $filter, $modal) {
    $scope.cataloged = null;
    console.log("JobQueueController.. is set up");
    $scope.searchParams = '';
    $scope.jobsList =[];
    $scope.inProgress = false;
    $scope.showPrevious = false;

    function updateList(eventType, data){
        var jobObj   = data;
        var type     = eventType;
        $timeout(function() {
          $scope.$apply(
            function () {
               $scope.searchParams = '';
               switch(type){
                   case 'jobCreate':
                       $scope.jobsList.push(jobObj);
                       break;
                   case 'jobState':
                         angular.forEach($scope.jobsList, function(item){
                             if(item.jobId == jobObj.jobId){
                                 item.jobState = jobObj.jobState;
                                 if(item.jobState == 'completed'){
                                     item.completed = true;
                                 }
                             }
                         });
                       break;
               }
            }
          );
        });
    }


    $scope.showPreviousCatalog = function(){

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                someData: function () {
                    return {videos:$scope.cataloged, topic:$scope.searchParams};
                }

            }
        });

        modalInstance.result.then(function () {
        }, function () {
            $scope.searchParams = '';
            $scope.showPrevious = false;
        });
    };

    $scope.updateJobState = function( jobId){
        $log.debug("updateJobState ="+jobId);
        $http({
            method: 'GET',
            url: '/api/ytv/state?jobId='+jobId
        }).success(function (result) {
            $log.debug("result updateJobState ="+result.jobState);
            updateList('jobState', {jobId:result.id, jobState:result.jobState});
        }).error(function (error) {
            //Showing error message
            $log.debug("error ="+error);
        });
    };

    $scope.fetchTopics = function(){
        $scope.inProgress = true;
        $http({
            method: 'GET',
            url: '/api/ytv/topic?srchPrms='+$scope.searchParams
        }).success(function (result) {
            $scope.inProgress = false;
            if(result.videos){
                $scope.showPrevious = true;
                $scope.cataloged = result.videos;
            }else{
                updateList('jobCreate', {jobId:result.id, ytTopic:result.ytTopic, jobState:'requested', completed:false});
            }

        }).error(function (error) {
                //Showing error message
            $scope.inProgress = false;
            $log.debug("error ="+error);
        });
    };

    (function () {
        // Using .success() and .error()
        $sails.get("/followingjobs")
            .success(function (data, status, headers, jwr) {
                console.log('Setting up Peter');
            })
            .error(function (data, status, headers, jwr) {
                console.log('Peter, we got a problem!');
            });

        // Using .then()
        $sails.get("/followingjobs")
            .then(function(resp){
                console.log('Setting up Paul');
            }, function(resp){
                console.log('Paul, we got a problem!');
            });

        // Watching for updates
        $sails.on("followingjobs", function (message) {
            updateList('jobState', {jobId:message.jobId,  jobState:message.type});
         });
    }());
}]);



// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'someData',
    function ($scope, $modalInstance, someData) {
    $scope.jobType = someData.videos.kind;
    $scope.videoAmount = someData.videos.items.length;
    $scope.searchParam = someData.topic;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);