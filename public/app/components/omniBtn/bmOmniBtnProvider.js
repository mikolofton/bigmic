var bmApp = angular.module('bigmic');
bmApp.provider('ButtonActions', [function() {
   var opts = {
     'default': {
       clazz: 'btn-success',
       text: 'Ask a Question',
       cb: function(){ alert('ask'); }
     },
     'active': {
       clazz: 'btn-warning',
       text: 'My Turn Now',
       cb: function(){ alert('active'); }
     },
     'cancel': {
       clazz: 'btn-danger',
       text: 'Cancel Question',
       cb: function(){ alert('cancel'); }
     },
     'queue': {
       clazz: 'btn-info',
       text: 'Waiting...',
       cb: function(){ alert('queue'); }
     }
   };
   return {
     config: function(key, val){
       opts = angular.extend(opts, {key: val});
     },
     $get: function(){
       return opts;
     }
   };
 }]);
