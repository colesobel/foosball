angular.module('myApp.services', [])

.service('testService', function() {
  this.sayShit = function(shit) {
    return shit
  }
})
