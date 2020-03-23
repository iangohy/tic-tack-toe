import React from 'react';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />);
  }

  makeBoard() {
    let board = []
    for (let x=0; x<3; x++) {
      let square = []
      for (let i=0; i<3; i++) {
        square = square.concat(<>{this.renderSquare(x*3 + i)}</>)
      }
      board = board.concat(<div className="board-row">{square}</div>)
    }
    return board;
  }
  render() {
    const board = this.makeBoard();
    return (
      board
    );
  }
}

export class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history:[{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState((prevState) => {
      return{
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        history: prevState.history.slice(0, step + 1),
    }});
  }

  restart() {
    this.jumpTo(0)
  }

  undo() {
    if (this.state.stepNumber === 0) {
      return
    } else {
      this.jumpTo(this.state.history.length - 2)
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = <div className="winner">{'Winner: ' + winner}</div>;
    } else if (!current.squares.includes(null)) {
      status = <div className="tie">It's a tie!</div>;
    } else {
      status = <div>{'Next player: ' + (this.state.xIsNext ? 'X' : 'O')}</div>;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          {status}
          <button onClick={() => this.undo()}>Undo last move</button>
          <button onClick={() => this.restart()}>Restart game</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
