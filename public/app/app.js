(function() {
	var bmApp = angular.module('bigmic', ['ui.router']);

	bmApp.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '../views/home.html',
				controller: 'BeginQACtrl'
			})
			.state('admin', {
				templateUrl: '../views/admin.html',
				controller: 'BeginQACtrl'
			})
			.state('admin.inprogress', {
				templateUrl: '../views/admin/inprogress.html'
			})
			.state('admin.endQA', {
				templateUrl: '../views/admin/endQA.html'
			})
			.state('guest', {
				templateUrl: '../views/guest.html',
				controller: 'BeginQACtrl'
			})
			.state('guest.inprogress', {
				templateUrl: '../views/guest/inprogress.html'
			})
			.state('guest.inqueue', {
				templateUrl: '../views/guest/inqueue.html'
			})
			.state('guest.current', {
				templateUrl: '../views/guest/current.html'
			})
			.state('guest.endQA', {
				templateUrl: '../views/guest/endQA.html'
			});
	});
})();
