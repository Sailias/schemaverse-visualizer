(function() {

  $(function() {
    visualizer.map.init();
    schemaverse.getPlanets(function(planetData) {
      visualizer.map.setXY(planetData);
      return visualizer.drawPlanets(planetData);
    });
    return console.log(window.schemaverse.planets);
  });

}).call(this);
