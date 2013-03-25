(function() {

  window.schemaverse = {
    players: [],
    previousShips: [],
    currentTic: -1,
    getTic: function() {
      return $.getJSON('tic', function(data) {
        return schemaverse.currentTic = data.currentTic.last_value;
      });
    },
    getPlayers: function() {
      return d3.json("players.json", function(data) {
        var player, players, _i, _len, _results;
        players = schemaverse.players;
        _results = [];
        for (_i = 0, _len = players.length; _i < _len; _i++) {
          player = players[_i];
          if (player.conqueror_id) {
            _results.push(players[player.conqueror_id] = player);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    },
    getTicData: function(ticNumber) {
      return d3.json('map_tic.json?tic=' + ticNumber, function(data) {
        var planetData, shipData;
        if (data) {
          shipData = data.ships;
          return planetData = data.planets;
        }
      });
    },
    getPlanets: function(callback) {
      return d3.json("planets.json", function(data) {
        var planetData;
        planetData = data.planets;
        planetData.map(function(d) {
          d.location_x = parseFloat(d.location_x, 10);
          d.location_y = parseFloat(d.location_y, 10);
          return d.conqueror_id = null;
        });
        if (typeof callback === 'function') return callback(planetData);
      });
    }
  };

}).call(this);
