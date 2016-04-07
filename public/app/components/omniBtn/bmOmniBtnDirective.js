var bmApp = angular.module('bigmic');
bmApp.config(['$stateProvider', '$urlRouterProvider', config])
  .component('omniBtn', {
    bindings: {
      text: '<',
      clazz: '<',
      onClick: '&'
    },
    templateUrl: 'bmOmniBtn.html'
  })


  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        controller: ['ButtonActions', function(btnStates) {
          var self = this;
          angular.extend(self, {
            isNotMe: true,
            btnStates: btnStates,
            state: btnStates['default']
          });
          self.doSomething = function(){
            return self.state.cb();
          }
        }],
        controllerAs: 'vm',
        template: `
          Something out of band controlls the state...<br>
          <label ng-repeat="i in vm.btnStates">
            <input
              type="radio"
              ng-model="vm.state"
              ng-value="i"
            > {{$index}}
          </label>
          <hr>
          <p>The component:
          <omni-btn
            text="vm.state.text"
            clazz="vm.state.clazz"
            on-click="vm.doSomething()"
          ></omni-btn></p>
          <p>is as dumb as it can be. Just triggers events and does DOM stuff.</p>
        `
      });
  }
