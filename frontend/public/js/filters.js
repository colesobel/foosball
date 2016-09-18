angular.module('myApp.filters', [])

.filter('percent', () => {
  return (number) => {
    return (number * 100).toFixed(0) + '%'
  }
})
