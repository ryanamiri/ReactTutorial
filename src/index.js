import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button 
        className="square" 
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    const rows = [0,3,6];
    const cols = [0,1,2];

    return (
      <div>
        {rows.map(i => {
          const inner = cols.map(j => this.renderSquare(i+j));
          return (<div className="board-row">
            {inner}
          </div>);
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movePosition: null,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
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
        squares: squares,
        movePosition: stringify(convertPos(i)),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step, move) => {
      const desc = move ? 'Go to move #' + move + ". Position: " + step.movePosition : 'Go to game start';
      let formattedDesc
      if(move === this.state.stepNumber) {
        formattedDesc = <strong>{desc}</strong>;
      } else {
        formattedDesc = desc;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{formattedDesc}</button>
        </li>
      );    
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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

function convertPos(i) {
  const firstCoord = Math.floor(i/3) + 1;
  const secondCoord = i % 3 + 1;
  return {firstCoord, secondCoord};
}

function stringify(coords) {
  return "(" + coords.firstCoord + ", " + coords.secondCoord + ")";
}
