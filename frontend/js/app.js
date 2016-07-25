var app = angular.module('myApp', ['ui.router', 'myApp.controllers', 'myApp.services'])

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('home')
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/partials/home.html',
      controller: 'mainController',
      controllerAs: 'main'
    })
    .state('addTeam', {
      url: '/add/team',
      templateUrl: '/partials/add-team.html',
      controller: 'addTeamController',
      controllerAs: 'at'
    })
    .state('addGame', {
      url: '/add/game',
      templateUrl: '/partials/add-game.html',
      controller: 'addGameController',
      controllerAs: 'ag'
    })
    .state('about', {
      url: '/about',
      templateUrl: '/partials/about.html',
      controller: 'aboutController',
      controllerAs: 'about'
    })
    .state('addPlayer', {
      url: '/add/player',
      templateUrl: '/partials/add-player.html',
      controller: 'addPlayerController',
      controllerAs: 'ap'
    })
    .state('leagueStandings', {
      url: '/leaugeStandings',
      templateUrl: '/partials/league-standings.html',
      controller: 'leagueStandingsController',
      controllerAs: 'ls'
    })
    .state('teamStats', {
      url: '/teamStats',
      templateUrl: '/partials/team-stats.html',
      controller: 'teamStatsController',
      controllerAs: 'ts'
    })
}])
