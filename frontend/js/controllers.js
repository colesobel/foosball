angular.module('myApp.controllers', [])


.controller('mainController', [function() {
  var self = this
}])


.controller('addTeamController', ['$http', 'testService', function($http, testService) {
  var self = this
  self.teamName = ''
  self.playerOne = ''
  self.playerTwo = ''
  self.created = false

  $http.get('http://localhost:3000/players').then(function(players) {
    self.playersList = players.data
  })

  self.createTeam = function() {
    postObj = {
      teamName: self.teamName,
      playerOne: self.playerOne,
      playerTwo: self.playerTwo
    }
    $http.post('http://localhost:3000/teams', postObj).then(function() {
      self.created = true
    })
  }

  this.work = testService.sayShit('shit')
  console.log(this.work);

}])



.controller('addGameController', ['$http', function($http) {
  var self = this
  this.created = false
  this.winning_goals
  this.losing_goals
  $http.get('http://localhost:3000/game/getTeams').then(function(teams) {
    self.teams = teams.data.rows
    self.winning_team = self.teams[0].team_name
    self.losing_team = self.teams[0].team_name
  })

  this.createGame = function() {
    var postObj = {
      winning_team: self.winning_team,
      losing_team: self.losing_team,
      winning_goals: self.winning_goals,
      losing_goals: self.losing_goals
    }
    $http.post('http://localhost:3000/game/new', postObj).then(function() {
      self.created = true
    })
  }


}])



.controller('aboutController', [function() {

}])

.controller('addPlayerController', ['$http', function($http) {
  var self = this
  this.created = false
  this.name = ''

  this.createPlayer = function() {
    postObj = {
      name: self.name
    }

    $http.post('http://localhost:3000/players', postObj).then(function() {
      self.created = true
    })
  }

}])


.controller('leagueStandingsController', ['$http', function($http) {
  var self = this
  $http.get('http://localhost:3000/standings/team').then(function(data) {
    self.standings = data.data
  })
  this.sortColumn = ''
  this.asc = false
  this.sortData = function(column) {
    self.asc = self.sortColumn == column ? !self.asc : true
    self.sortColumn = column
  }
}])

.controller('teamShowController', ['$http', '$stateParams', function($http, $stateParams) {
  var self = this
  $http.get('http://localhost:3000/teams/getName/' + $stateParams.id).then(function(data) {
    self.teamName = data.data
  })

  $http.get('http://localhost:3000/teams/' + $stateParams.id).then(function(data) {
    self.stats = data.data
  })


}])

.controller('playerStandingsController', ['$http', function($http) {
  var self = this
  $http.get('http://localhost:3000/standings/player').then(function(data) {
    self.standings = data.data
  })
  this.sortColumn = ''
  this.asc = false
  this.sortData = function(column) {
    self.asc = self.sortColumn == column ? !self.asc : true
    self.sortColumn = column
  }

}])

.controller('playerShowController', ['$http', '$stateParams', function($http, $stateParams) {
  var self = this
  $http.get('http://localhost:3000/players/' + $stateParams.id).then(function(data) {
    self.player = data.data
  })
}])
