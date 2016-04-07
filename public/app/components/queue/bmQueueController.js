var bmApp = angular.module('bigmic');

bmApp.controller('bmQueueCtrl', function (socket, $scope) {

  this.doneSpeaking = function() {
    socket.emit('qa:donespeaking');
  };

  socket.on('qa:updatequeue', function(speakers) {
    console.log('Received: qa:updatequeue', speakers);
    $scope.speakers = speakers.queue;
    $scope.$apply();
  });

});
