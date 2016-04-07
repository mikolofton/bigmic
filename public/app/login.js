(function() {
	var bmApp = angular.module('bigmic');

	bmApp
		.factory('LoginFactory', function($http) {
			return {
				getUser: function() {
					return $http.get('/api/user').then(function(res) {
						return res;
					});
				}
			}
		})
		.controller('LoginCtrl', function(LoginFactory, $scope, socket, $state) {
			$scope.user;
			$scope.state;

			LoginFactory.getUser().then(function(res) {
				$scope.user = res.data;
				var member = res.data.id;
				socket.emit('qa:new-user', {
					guest: member
				}, function() {
					console.log('emit: new user');
				});
			});

			$scope.changeState = function (location) {
				console.log('\n- changing state: ' + location);
				$scope.state = location;
				$state.go(location);
			}

		})
})();
