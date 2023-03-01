import { Maze } from "./utlis.js";
import { useState, useEffect } from "react";

function App() {
  const [gridSize, setGridSize] = useState(10);
  const [inputValue, setInputValue] = useState(gridSize);
  const [grid, setGrid] = useState(null);
  const [currentPos, setCurrentPos] = useState([0, 0]);
  const [clickCount, setClickCount] = useState(0);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
    if (currentPos[0] !== gridSize-1 || currentPos[1] !== gridSize-1) {
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        setCurrentPos(() => [...maze.movePlayerPos(currentPos, "left")]);
      };
      if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        setCurrentPos(() => [...maze.movePlayerPos(currentPos, "right")]);
      };
      if (e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        setCurrentPos(() => [...maze.movePlayerPos(currentPos, "top")]);
      };
      if (e.key === "ArrowDown" || e.key === "s") {
        e.preventDefault();
        setCurrentPos(() => [...maze.movePlayerPos(currentPos, "bottom")]);
      };
    };
  };

  const showBanner = () => {
    if (currentPos[0] === gridSize-1 && currentPos[1] === gridSize-1) {
      return <div style={{height: isMobile ? 50 : 100, fontSize: isMobile ? 20: 30}} className="banner" onClick={restartGame}>YOU WON! CLICK HERE TO PLAY AGAIN</div>
    };
  };

  const triggerKeydown = (key) => {
    const event = new KeyboardEvent('keydown', {
      key: key
    });
    document.dispatchEvent(event);
  };

  const showControls = () => {
    if (isMobile) {
      return (
        <div className="controls_container">
          <div className="arrow up" onMouseDown={() => triggerKeydown("w")}><p>up</p></div>
          <div className="left-right">
            <div className="arrow left" onMouseDown={() => triggerKeydown("a")}><p>left</p></div>
            <div className="arrow right" onMouseDown={() => triggerKeydown("d")}><p>right</p></div>
          </div>
          <div className="arrow down" onMouseDown={() => triggerKeydown("s")}><p>down</p></div>
        </div>
      );
    };
  };

  const restartGame = () => {
    setCurrentPos([0, 0]); 
    setGridSize(inputValue); 
    setClickCount(clickCount+1)
  };

  const maxLimit = () => {
    return isMobile ? 13 : 40;
  };

  useEffect(() => {
    maze = new Maze(gridSize);
    maze.setup();
    setGrid(maze.draw());
    console.log(maze.solveMaze());

    document.addEventListener('keydown', controls);
    return () => document.removeEventListener("keydown", controls);
  }, [clickCount]);

  return (
    <>
        <div className="container">
          <div className="input_container">
            <p>{isMobile ? "Use on-screen controls to play" : "Use WASD keys or Arrow keys to play"}</p>
            <p>{`Maze Size (5-${maxLimit()})`}</p>
            <input type="number" min={5} max={maxLimit()} name="maze-size" value={inputValue} onChange={(e) => {setInputValue(parseInt(e.target.value));}} onBlur={(e) => {
              if (e.target.value < 5 || e.target.value > maxLimit()) {
                if (Math.abs(e.target.value-maxLimit()) < Math.abs(e.target.value-5)) {
                  setInputValue(maxLimit());
                } else {
                  setInputValue(5);
                };
              };
            }}/>
          <button onClick={restartGame}>Restart game</button>
        </div>
        <table style={{width: gridSize*35}}>
          <tbody>
            {drawMaze(5, 5)}
          </tbody>
        </table>
        {showControls()}
      </div>
      {showBanner()}
    </>
  );
};

export default App;
