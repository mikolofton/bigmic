var bmApp = angular.module('bigmic');
bmApp.directive('bmQueue', function () {
  return {
    templateUrl: '../app/components/queue/bmQueueView.html',
    controller: 'bmQueueCtrl',
    controllerAs: 'vm',
    link: function ($scope, element, attributes) {
      $scope.role = attributes['role'];
    }
  }
});
