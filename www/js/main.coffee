$ ->
  # Initialize the map
  visualizer.map.init()

  # Get the initial planet data
  schemaverse.getPlanets((planetData) ->

    # Set the map bounds and more map initialization stuff
    visualizer.map.setXY(planetData)

    # Draw all the planets for the first time
    visualizer.drawPlanets(planetData)
  )

  console.log window.schemaverse.planets