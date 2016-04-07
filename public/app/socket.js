(function() {
	var bmApp = angular.module('bigmic');

	bmApp
		.factory('socket', function () {
			var server = 'http://localhost:3000/';
			var socket = io.connect(server);
			return {
				on: function(eventName, callback){
					socket.on(eventName, callback);
				},
				emit: function(eventName, data) {
					socket.emit(eventName, data);
				}
			};
		});
})();
