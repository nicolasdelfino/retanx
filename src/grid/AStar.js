// A* pathfinding
export let AStar = (_grid, start, end, units, currentSelectionID) => {
  console.log('A*')

  // Reset score of cells
  _grid.resetCells()

  // pass tanks to grid and make them obstacles
  _grid.makeObstaclesOfUnitsWithHigherMass(units[currentSelectionID], units, currentSelectionID)

  // Add possible cell neighbors, pass unit A* style
  let aStarStyle = units[currentSelectionID].aStarStyle
  _grid.addCellNeighbors(aStarStyle)

  let openSet   = []
  let closedSet = []
  let path      = []
  // Add start to the open set
  openSet.push(start)

  // A*
  do {
    let lowestFScore = 0
    for(var i = 0; i < openSet.length; i++) {
      if(openSet[i].f < openSet[lowestFScore].f) {
        lowestFScore = i
      }
    }

    // Set new current
    let current = openSet[lowestFScore]

    if(openSet[lowestFScore] === end) {
      // console.log('A* finished')

      // Calc 'came from'
      let tempCell = current
      path.push(tempCell)
      while(tempCell.previous) {
        tempCell.isPath = true
        tempCell.tempPathString = tempCell.x + ',' + tempCell.y
        tempCell.tempPathString = ''
        path.push(tempCell.previous)
        tempCell = tempCell.previous
      }
    }

    let clone = openSet.slice(0)
    openSet   = removeFromArray(clone, current)
    closedSet.push(current)

    let neighbors = current.neighbors
    for(var j = 0; j < neighbors.length; j++) {
      var neighbor = neighbors[j]

      if(!closedSet.includes(neighbor) && !neighbor.obstacle) {
        let tentativeG = current.g + 1
        if(openSet.includes(neighbor)) {
          if(tentativeG < neighbor.g) {
            neighbor.g = tentativeG
          }
        }
        else {
          neighbor.g = tentativeG
          openSet.push(neighbor)
        }

        neighbor.h = heuristic(neighbor, end)
        neighbor.f = neighbor.g + neighbor.h
        neighbor.previous = current
      }
    }
  } while (openSet.length > 0)

  // for(var p = 0; p < path.length; p++) {
  //   if(p > 0 && p < path.length-1) {
  //     let previousCell = path[p -1]
  //     let currentCell = path[p]
  //     let nextCell = path[p + 1]
  //
  //     console.log('pre x', previousCell.x, 'pre y', previousCell.y)
  //     console.log('next x', nextCell.x, 'next y', nextCell.y)
  //
  //     if(previousCell.x !== nextCell.x && nextCell.y !== currentCell.y) {
  //       let c = _grid.getGrid()[currentCell.x][currentCell.y]
  //       console.warn('c', c)
  //       _grid.getGrid()[currentCell.x][currentCell.y].isPathDirectionTurn = true
  //     }
  //   }
  // }

  return path
}

function removeFromArray(openSet, current) {
  let arrayWithoutCurrent = openSet.filter((item) => {
    return item !== current
  })

  return arrayWithoutCurrent
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}
