import { Maze } from "./utlis.js";
import { useState, useEffect, useRef } from "react";

function App() {
  const [gridSize, setGridSize] = useState(10);
  const [inputValue, setInputValue] = useState(gridSize);
  const [grid, setGrid] = useState(null);
  const gridRef = useRef(grid);
  const [currentPos, setCurrentPos] = useState([0, 0]);
  const currentPosRef = useRef(currentPos);
  const [clickCount, setClickCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  var maze;

  const generateClassName = (walls, r, c) => {
    let className = ["", ""];
    let cell = gridRef.current[r][c];

    Object.keys(walls).map((wall) => {
      if (walls[wall]) className[0]+=(` border-${wall}`);
    });

    if (cell.path && !cell.playerVisited && checked) className[1]+='path';
    if (r===currentPos[0] && c===currentPos[1]) {
      cell.playerVisited = true;
      className[1]='player-position';
    };
    if (isLastCell(r, c)) className[1]+=' finish';

    return className;
  };

  const drawMaze = () => {
    if (gridRef.current !== null) {
      return gridRef.current.map((row, i) => {
        return <tr className="table-row" key={`${i}`}>
          {row.map((col, j) => {
            let [cellClassName, playerPosClassName] = generateClassName(col.walls, i, j);
            return <td className={`table-col${cellClassName}`} key={`${i}${j}`}><div className={playerPosClassName}/></td>
          })}
        </tr>
      });
    };
  };

  const isLastCell = (row, column) => {
    return row===gridSize-1 && column===gridSize-1;
  };

  const helper = (direction) => {
    let nextPos = maze.movePlayerPos([...currentPosRef.current], direction);
    let currentCell = gridRef.current[currentPosRef.current[0]][currentPosRef.current[1]];
    let nextCell = gridRef.current[nextPos[0]][nextPos[1]];
    let [currentPosRow, currentPosCol] = currentPosRef.current;
    let [nextPosRow, nextPosCol] = nextPos;

    if (currentPosRow !== nextPosRow || currentPosCol !== nextPosCol) {
      
      if (nextCell.playerVisited) {
        currentCell.playerVisited = false;

      } else if (!nextCell.path && !isLastCell(nextPosRow, nextPosCol)) {
        currentCell.playerVisited = false;
        currentCell.path = true;
      };
    };
    
    return nextPos;
  };

  const controls = (e) => {
    if (!isLastCell(currentPosRef.current[0], currentPosRef.current[1])) {
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        let nextPos = helper("left");
        currentPosRef.current = [...nextPos];
        setCurrentPos(() => [...nextPos]);
      };

      if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        let nextPos  = helper("right");
        currentPosRef.current = [...nextPos];
        setCurrentPos(() => [...nextPos]);
      };

      if (e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        let nextPos = helper("top");
        currentPosRef.current = [...nextPos];
        setCurrentPos(() => [...nextPos]);
      };

      if (e.key === "ArrowDown" || e.key === "s") {
        e.preventDefault();
        let nextPos = helper("bottom");
        currentPosRef.current = [...nextPos];
        setCurrentPos(() => [...nextPos]);
      };
    };
  };

  const showBanner = () => {
    if (isLastCell(currentPos[0], currentPos[1])) {
      return <div style={{height: isMobile ? 40 : 100, fontSize: isMobile ? 20: 30}} className="banner" onClick={restartGame}>YOU WON! CLICK HERE TO PLAY AGAIN</div>
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
    currentPosRef.current = [0, 0];
    setGridSize(inputValue); 
    setClickCount(clickCount+1);
  };

  const checkMazeSize = (e) => {
    if (e.target.value < 5 || e.target.value > maxLimit()) {
      if (Math.abs(e.target.value-maxLimit()) < Math.abs(e.target.value-5)) {
        setInputValue(maxLimit());
      } else {
        setInputValue(5);
      };
    };
  };

  const maxLimit = () => {
    return isMobile ? 14 : 40;
  };

  useEffect(() => {
    maze = new Maze(gridSize);
    maze.setup();
    let grid = maze.draw();
    gridRef.current = grid;
    setGrid(grid);

    document.addEventListener('keydown', controls);
    return () => document.removeEventListener("keydown", controls);
  }, [clickCount]);

  return (
    <>
      <div className="container">
        <div className="input_container">
          <p>{isMobile ? "Use on-screen controls to play" : "Use WASD keys or Arrow keys to play"}</p>
          <div className="checkbox">
            <p>Cheat Mode</p>
            <input type={"checkbox"} checked={checked} onChange={() => setChecked(!checked)}/>
          </div>
          <p>{`Maze Size (5-${maxLimit()})`}</p>
          <input className="maze_size" type="number" min={5} max={maxLimit()} name="maze-size" value={inputValue} 
            onChange={(e) => setInputValue(parseInt(e.target.value))} 
            onBlur={checkMazeSize}/>
          <button onClick={restartGame}>Restart game</button>
        </div>
        <table style={{width: gridSize*(30)}}>
          <tbody>
            {drawMaze()}
          </tbody>
        </table>
        {showControls()}
      </div>
      {showBanner()}
    </>
  );
};

export default App;
