import { Maze } from "./utlis.js";
import { useState, useEffect } from "react";

function App() {
  const [gridSize, setGridSize] = useState(10);
  const [inputValue, setInputValue] = useState(gridSize);
  const [grid, setGrid] = useState(null);
  const [currentPos, setCurrentPos] = useState([0, 0]);
  const [clickCount, setClickCount] = useState(0);
  var maze;

  const generateClassName = (walls, r, c) => {
    let className = ["", ""];
    Object.keys(walls).map((wall) => {
      if (walls[wall]) className[0]+=(` border-${wall}`);
    });

    if (r===currentPos[0] && c===currentPos[1]) className[1]+='player-position';
    if (r===gridSize-1 && c===gridSize-1) className[1]+=' finish';

    return className;
  };

  const drawMaze = () => {
    if (grid !== null) {
      return grid.map((row, i) => {
        return <tr className="table-row" key={`${i}`}>
          {row.map((col, j) => {
            let [cellClassName, playerPosClassName] = generateClassName(col.walls, i, j);
            return <td className={`table-col${cellClassName}`} key={`${i}${j}`}><div className={playerPosClassName}/></td>
          })}
        </tr>
      });
    };
  };

  const controls = (e) => {
    e.preventDefault();
    if (currentPos[0] !== gridSize-1 || currentPos[1] !== gridSize-1) {
      if (e.key === "ArrowLeft" || e.key === "a") setCurrentPos(() => [...maze.movePlayerPos(currentPos, "left")]);
      if (e.key === "ArrowRight" || e.key === "d") setCurrentPos(() => [...maze.movePlayerPos(currentPos, "right")])
      if (e.key === "ArrowUp" || e.key === "w") setCurrentPos(() => [...maze.movePlayerPos(currentPos, "top")]);
      if (e.key === "ArrowDown" || e.key === "s") setCurrentPos(() => [...maze.movePlayerPos(currentPos, "bottom")]);
    };
  };

  const showBanner = () => {
    if (currentPos[0] === gridSize-1 && currentPos[1] === gridSize-1) {
      return <div className="banner" onClick={restartGame}>YOU WON! CLICK HERE TO PLAY AGAIN</div>
    };
  };

  const restartGame = () => {
    setCurrentPos([0, 0]); 
    setGridSize(inputValue); 
    setClickCount(clickCount+1)
  };

  useEffect(() => {
    maze = new Maze(gridSize);
    maze.setup();
    setGrid(maze.draw());
    console.log(maze.solveMaze());

    document.addEventListener('keydown', controls);

  }, [clickCount]);

  return (
    <>
        <div className="container">
          <div className="input_container">
            <p>Maze Size (5-40)</p>
            <input type="number" min={5} max={40} value={inputValue} onChange={(e) => {
              if (e.target.value < 5 || e.target.value > 40) {
              if (e.target.value-40 < e.target.value-5) {
                setInputValue(40);
              } else {
                setInputValue(5);
              };
            }
            setInputValue(e.target.value);
          }}/>
          <button onClick={restartGame}>Restart game</button>
        </div>
        <table style={{width: gridSize*35}}>
          <tbody>
            {drawMaze(5, 5)}
          </tbody>
        </table>
      </div>
      {showBanner()}
    </>
  );
};

export default App;