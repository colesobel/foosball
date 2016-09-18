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

  $http.get('https://warm-savannah-20777.herokuapp.com/players').then(function(players) {
    self.playersList = players.data
  })

  self.createTeam = function() {
    postObj = {
      teamName: self.teamName,
      playerOne: self.playerOne,
      playerTwo: self.playerTwo
    }
    $http.post('https://warm-savannah-20777.herokuapp.com/teams', postObj).then(function() {
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
  $http.get('https://warm-savannah-20777.herokuapp.com/game/getTeams').then(function(teams) {
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
    $http.post('https://warm-savannah-20777.herokuapp.com/game/new', postObj).then(function() {
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

    $http.post('https://warm-savannah-20777.herokuapp.com/players', postObj).then(function() {
      self.created = true
    })
  }

}])


.controller('leagueStandingsController', ['$http', function($http) {
  var self = this
  $http.get('https://warm-savannah-20777.herokuapp.com/standings/team').then(function(data) {
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
  $http.get('https://warm-savannah-20777.herokuapp.com/teams/getName/' + $stateParams.id).then(function(data) {
    self.teamName = data.data
  })

  $http.get('https://warm-savannah-20777.herokuapp.com/standings/team').then(function(data) {
    self.teamRow = data.data.filter(function(team) {
      return team.team_id == $stateParams.id
    })
  })

  $http.get('https://warm-savannah-20777.herokuapp.com/teams/' + $stateParams.id).then(function(data) {
    var stats = data.data
    self.stats = stats.filter(function(team) {
      return team.wins_against != 0 || team.losses_against != 0
    })
  })

  $http.get(`https://warm-savannah-20777.herokuapp.com/teams/${$stateParams.id}/vsPlayers`).then(function(data) {
    self.vsPlayers = data.data.filter(function(player) {
      return player.wins != 0 || player.losses != 0
    })
  })


  $http.get(`https://warm-savannah-20777.herokuapp.com/teams/${$stateParams.id}/goalsByGame`).then(function(data) {
    console.log(data.data);
    self.gameNumber = data.data.map(function (game) {
      return game.game_number
    })

    self.goals_for = data.data.map(function (game) {
      return game.goals_for
    })

    self.goals_against = data.data.map(function (game) {
      return game.goals_against
    })

    var ctx = document.getElementById("teamGoalsChart");
    var data = {
    labels: self.gameNumber,
    datasets: [
            {
                label: "Goals For",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "green",
                borderColor: "green",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: self.goals_for,
                spanGaps: false,
            },
            {
                label: "Goals Against",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "red",
                borderColor: "red",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: self.goals_against,
                spanGaps: false,
            }
        ]
    };

    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                xAxes: [{
                  display: true
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
            }
        }
    });
  })





}])

.controller('playerStandingsController', ['$http', function($http) {
  var self = this
  $http.get('https://warm-savannah-20777.herokuapp.com/standings/player').then(function(data) {
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
  $http.get('https://warm-savannah-20777.herokuapp.com/players/' + $stateParams.id).then(function(data) {
    self.player = data.data
  })

  $http.get(`https://warm-savannah-20777.herokuapp.com/players/${$stateParams.id}/getStats`).then(function(data) {
    self.stats = data.data.filter(function(player) {
      return (player.wins_against != 0 || player.losses_against != 0)
    })
  })

  $http.get(`https://warm-savannah-20777.herokuapp.com/players/${$stateParams.id}/vsTeams`).then(function(data) {
    self.vsTeams = data.data.filter(function(team) {
      return (team.wins != 0 || team.losses != 0)
    })
  })



  $http.get(`https://warm-savannah-20777.herokuapp.com/players/${$stateParams.id}/goalsByGame`).then(function(data) {
    console.log(data.data);
    self.gameNumber = data.data.map(function (game) {
      return game.game_number
    })

    self.goals_for = data.data.map(function (game) {
      return game.goals_for
    })

    self.goals_against = data.data.map(function (game) {
      return game.goals_against
    })

    var ctx = document.getElementById("playerGoalsChart");
    var data = {
    labels: self.gameNumber,
    datasets: [
            {
                label: "Goals For",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "green",
                borderColor: "green",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: self.goals_for,
                spanGaps: false,
            },
            {
                label: "Goals Against",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "red",
                borderColor: "red",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: self.goals_against,
                spanGaps: false,
            }
        ]
    };

    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                xAxes: [{
                  display: true
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
            }
        }
    });
  })




}])
