import React, { useEffect, useState } from 'react';
import createBoard from '../util/createBoard';
import Cell from './Cell';
import { revealed } from '../util/reveal';
import Modal from './Modal';
import Timer from './Timer';

const Board = () => {
    const [grid, setGrid] = useState([]);
    const [nonMinesCount, setNonMineCount] = useState(0);
    const [mineLocations, setMineLocations] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    // component did mount
    useEffect(() => {
        // creating board
        function freshBoard() {
            const newBoard = createBoard(15, 20, 25);
            setNonMineCount(15 * 20 - 25);
            setMineLocations(newBoard.mienLocation)
            setGrid(newBoard.board);
        }
        // calling fucntion
        freshBoard();
    }, []);

    // on Right click/ flag cell
    const updateFlag = (e, x, y) => {
        // stop dropdown on right click
        e.preventDefault();
        // deep copy of a state
        let newGrid = JSON.parse(JSON.stringify(grid));
        console.log(newGrid[x][y]);
        newGrid[x][y].flagged = true;
        setGrid(newGrid);
    };

    // Reveal Cell
    const revealCell = (x, y) => {
        if (grid[x][y].revealed || gameOver) {
            return;
        }
        let newGrid = JSON.parse(JSON.stringify(grid));
        if (newGrid[x][y].value === "X") {
            alert('mine found')
            for (let i = 0; i < mineLocations.length; i++) {
                newGrid[mineLocations[i][0]][mineLocations[i][1]].revealed = true
            }
            setGrid(newGrid);
            setGameOver(true);
        } else {
            let newRevealedBoard = revealed(newGrid, x, y, nonMinesCount);
            setGrid(newRevealedBoard.arr)
            setNonMineCount(newRevealedBoard.newNonMinesCount);
            if (newRevealedBoard.newNonMinesCount === 0) {
                setGameOver(true);
            }
        }
    }

    return (
        <div>
            <p>{JSON.stringify(gameOver)}</p>
            <Timer />
            <div
                style={
                    {
                        display: 'flex',
                        flexDirection: "column",
                        alignItems: 'center',
                    }}>
                {gameOver && <Modal />}
                {grid.map((singleRow, index1) => {
                    return (
                        <div style={{ display: "flex" }} key={index1}>
                            {singleRow.map((singleBlock, index2) => {
                                return <Cell
                                    revealCell={revealCell}
                                    key={`${index1}-${index2}`}
                                    details={singleBlock}
                                    updateFlag={updateFlag}
                                />
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    )


};

export default Board;