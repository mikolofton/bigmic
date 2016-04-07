(function() {
	var bmApp = angular.module('bigmic');

	bmApp
		.controller('BeginQACtrl', function(LoginFactory, socket, $scope, $state) {
			var _this = this;
			$scope.user;
			$scope.speakers;
			$scope.inProgress = false;
			$scope.isActive = false;

			$scope.beginQA = function() {
				socket.emit('qa:start');
			}
			$scope.endQA = function() {
				socket.emit('qa:end');
				$scope.changeState('guest.endQA');
			}
			$scope.enterQueue = function() {
				socket.emit('qa:enterqueue', $scope.user);
				$scope.changeState('guest.inqueue');
			};
			$scope.leaveQueue = function() {
				socket.emit('qa:leavequeue', $scope.user);
				$scope.changeState('guest.inprogress');
			};

			LoginFactory.getUser().then(function(res) {
				_this.user = res.data;
			});

			socket.on('qa:view', function(view) {
				$scope.$apply(function() {
					$scope.role = view;
					if ($scope.role) {
						$scope.changeState($scope.role);
					}
				});
				console.log('Received: View Event');
			});

			socket.on('qa:inprogress', function(role) {
				$scope.$apply(function() {
					$scope.inProgress = true;
					var view = role + '.inprogress';
					if (view) {
						$scope.changeState(view);
					}
				});
				console.log('Received: In Progress Event');
			});

			socket.on('qa:currentguest', function (currentguest) {
				console.log('Received: qa:currentguest', currentguest.user);
				$scope.currentguest = currentguest.user;
				if ($scope.currentguest.id === $scope.user.id) {
					$scope.isActive = true;
					var view = 'guest.current';
					if (view) {
						$scope.changeState(view);
					}
				} else {
					$scope.isActive = false;
				}
				$scope.$apply();
			});

			socket.on('qa:end', function(role) {
				console.log('Received: qa:endQA');
				$scope.$apply(function() {
					$scope.inProgress = false;
					var view = role + '.endQA';
					if (view) {
						$scope.changeState(view);
					}
				});

			});

		});
})();
