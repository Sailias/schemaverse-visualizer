var schemaverse = {
  common:{
    players:[],
    previousShips:[],
    currentTic:-1,
    color:d3.scale.category20(),
    init:function () {
      var playersInterval = setInterval(schemaverse.common.getPlayers, 300000);
    },
    symbol:function (i) {
      var symbols = ["\u2640", "\u2641", "\u2642", "\u2643", "\u2644", "\u2645", "\u2646", "\u2647", "\u2648", "\u2649", "\u2642", "\u264A", "\u264B", "\u264C", "\u264D", "\u264E", "\u264F", "\u2630", "\u2631", "\u2632", "\u2633", "\u2634", "\u2635", "\u2636", "\u2637", "\u2638", "\u2639", "\u2632", "\u263A", "\u263B", "\u263C", "\u263D", "\u263E", "\u263F", "\u2640", "\u2641", "\u2642", "\u2643", "\u2644", "\u2645", "\u2646", "\u2647", "\u2648", "\u2649", "\u2642", "\u264A", "\u264B", "\u264C", "\u264D", "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653", "\u2654", "\u2655", "\u2656", "\u2657", "\u2658", "\u2659", "\u2652", "\u265A", "\u265B", "\u265C", "\u265D", "\u265E", "\u265F"];
      var length = symbols.length;

      return symbols[i % length];
    },

    getSymbol:function (d, i) {
      if (d.conqueror_id === null) {
        return "\u26aa";
      }
      else if (d.conqueror_symbol) {
        return d.conqueror_symbol;
      }
      return schemaverse.common.symbol(d.conqueror_id);
    },

    getColor:function (d, i) {
      if (d.conqueror_id === null) {
        return '#000';
      }
      else if (d.conqueror_color) {
        return '#' + d.conqueror_color;
      }
      return schemaverse.common.color(d.conqueror_id);
    },

    getPlayers:function (callback) {
      d3.json("players.json", function (data) {
        var players = schemaverse.common.players;
        for (var i = 0, length = data.players.length; i < length; i++) {
          var player = data.players[i];
          if (player.conqueror_id) {
            players[player.conqueror_id] = player;
          }
        }
        if (callback && typeof callback === 'function') {
          callback();
        }
      });
    },

    drawPlanets:function (planetData, vis, x, y) {

      planets = vis.selectAll("text.planet")
        .data(planetData, function (d) {
          return d.id;
        });

      var enter = planets.enter().append("text")
        .attr('id', function (d) {
          return 'planet-' + d.id;
        })
        .attr('dx', -5)
        .attr('dy', 5);

      if (x && y) {
        enter.attr("transform", function (d) {
          return "translate(" + x(d.location_x) + "," + y(d.location_y) + ")";
        });
      }


      planets
        .attr("class", function (d) {
          var classes = 'dot planet';
          return classes;
        })
        .attr("fill", schemaverse.common.getColor)
        .text(schemaverse.common.getSymbol);
    },
    drawShips:function (shipData, vis, x, y) {

      $.each(schemaverse.common.previousShips, function (i, arr) {
        $.each(arr, function (i, ele) {
          $(ele).remove();
        });
      });

      ships = vis.selectAll("text.planet")
        .data(shipData, function (d) {
          return d.id;
        });

      var enter = ships.enter().append("text")
        .attr('id', function (d) {
          return 'planet-' + d.id;
        })
        .attr('dx', -5)
        .attr('dy', 5);

      if (x && y) {
        enter.attr("transform", function (d) {
          return "translate(" + x(d.location_x) + "," + y(d.location_y) + ")";
        });
      }

      ships
        .attr("fill", 'green')
        .text('@');

      schemaverse.common.previousShips.push(ships);
    }

  },
  map:{
    vis:null,
    x:null,
    y:null,
    init:function (callback) {
      var width = 753;
      var height = 753;
      var margin = 1;
      var extentX;
      var extentY;
      var x;
      var y;
      var xrule;
      var yrule;

      var vis = schemaverse.map.vis = d3.select("#container .main")
        .append("svg")
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2)
        .attr("class", "map")
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

      vis.append("rect")
        .attr("width", width)
        .attr("height", height);

      function getPlanets(callback) {

        d3.json("planets.json", function (data) {
          var planetData = data.planets;

          schemaverse.common.players.map(function (d) {
            d.count = 0;
          });

          planetData.map(function (d) {
            d.location_x = parseFloat(d.location_x, 10);
            d.location_y = parseFloat(d.location_y, 10);
            d.conqueror_id = null;
          });

          if (x === undefined && y === undefined) {

            extentX = d3.extent(planetData, function (d) {
              return d.location_x;
            });

            extentY = d3.extent(planetData, function (d) {
              return d.location_y;
            });

            x = schemaverse.map.x = d3.scale.linear()
              .range([0, width])
              .domain(extentX)
              .clamp(true)
              .nice();

            y = schemaverse.map.y = d3.scale.linear()
              .range([0, height])
              .domain(extentY)
              .clamp(true)
              .nice();

            xrule = vis.selectAll("g.x")
              .data(x.ticks(10))
              .enter().append("g")
              .attr("class", "x");

            xrule.append("line")
              .attr("x1", x)
              .attr("x2", x)
              .attr("y1", 0)
              .attr("y2", height);

            yrule = vis.selectAll("g.y")
              .data(y.ticks(10))
              .enter().append("g")
              .attr("class", "y");

            yrule.append("line")
              .attr("x1", 0)
              .attr("x2", width)
              .attr("y1", y)
              .attr("y2", y);
          }

          if (planetData) {
            schemaverse.common.drawPlanets(planetData, vis, x, y);
          }

          if (callback && typeof callback === 'function') {
            callback();
          }

          $.getJSON('tic', function (data) {
            schemaverse.common.currentTic = data.currentTic.last_value;
            mapTics(1)
          });

        });
      }

      function mapTics(ticNumber) {
        d3.json('map_tic.json?tic=' + ticNumber, function (data) {
          if (data) {
            var shipData = data.ships;
            var planetData = data.planets;
          }

          if (shipData && planetData) {

            $('#tic_value').html(ticNumber);

            shipData.map(function (d) {
              d.location_x = parseFloat(d.location_x, 10);
              d.location_y = parseFloat(d.location_y, 10);
              d.conqueror_id = parseInt(d.conqueror_id, 10) || null;
              if (schemaverse.common.players[d.conqueror_id]) {
                d.conqueror_name = schemaverse.common.players[d.conqueror_id].conqueror_name;
                d.conqueror_color = schemaverse.common.players[d.conqueror_id].rgb;
                d.conqueror_symbol = '@';
                schemaverse.common.players[d.conqueror_id].count++;
              }
            });

            schemaverse.common.drawShips(shipData, vis, x, y);

            $('#planets_tic').html(planetData.length);
            $.each(planetData, function (i, pData) {
              $planetText = $('#planet-' + pData.referencing_id);

              // TODO: USER MY PLAYER ID!
              if (pData.player_id_1 === "8057") {
                $planetText.text('R').attr('fill', 'red');
                var planetCount = parseInt($('#total_planets').html());
                $('#total_planets').html(planetCount + 1);
              }
              else {
                $planetText.text("\u26aa").attr('fill', 'black');
                var planetCount = parseInt($('#total_planets').html());
                $('#total_planets').html(planetCount - 1);
              }
            });
          }

          if (ticNumber < schemaverse.common.currentTic)
            mapTics(ticNumber + 1);
        })
      }

      getPlanets();
      //var planetsInterval = setInterval(getPlanets, 30000);
    }
  }



};
schemaverse.common.getPlayers(function () {
  schemaverse.map.init(function () {

  });
  var playerInterval = setInterval(schemaverse.common.getPlayers, 120000);

});