window.schemaverse = {
  players: []
  previousShips: []
  currentTic: -1

  getTic: () ->
    $.getJSON 'tic', (data) ->
      schemaverse.currentTic = data.currentTic.last_value
      # TODO
      #mapTics(1)

  getPlayers: () ->
    d3.json "players.json", (data) ->
      players = schemaverse.players
      for player in players
        if (player.conqueror_id)
          players[player.conqueror_id] = player

  getTicData: (ticNumber) ->
    d3.json 'map_tic.json?tic=' + ticNumber, (data) ->
      if (data) 
        shipData = data.ships
        planetData = data.planets

  getPlanets: (callback) ->
    d3.json "planets.json", (data) ->
      planetData = data.planets
      planetData.map (d) ->
        d.location_x = parseFloat(d.location_x, 10)
        d.location_y = parseFloat(d.location_y, 10)
        d.conqueror_id = null

      if typeof callback is 'function'
        callback(planetData)
}