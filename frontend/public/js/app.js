var app = angular.module('myApp', ['ui.router', 'myApp.controllers', 'myApp.services', 'myApp.filters'])

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
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
    .state('playerStandings', {
      url: '/playerStandings',
      templateUrl: '/partials/player-standings.html',
      controller: 'playerStandingsController',
      controllerAs: 'ps'
    })
    .state('teamShow', {
      url: '/teams/:id',
      templateUrl: '/partials/team-show.html',
      controller: 'teamShowController',
      controllerAs: 'ts'
    })
    .state('playerShow', {
      url: '/players/:id',
      templateUrl: '/partials/player-show.html',
      controller: 'playerShowController',
      controllerAs: 'pshow'
    })

    $locationProvider.html5Mode(true);
}])
