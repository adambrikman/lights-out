import React, {Component} from "react";
import Cell from "./Cell";
import './styles/Board.css';
import './styles/stars.scss';
import './styles/button.scss';
import $ from 'jquery';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {

  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };

  constructor(props) {
    super(props);

    this.state = {
      hasWon: false,
      board: this.createBoard()
    }
    this.resetGame = this.resetGame.bind(this);
  }

  // Generate Stars
  componentDidMount() {
    var cols = ['#f5d76e','#f7ca18','#f4d03f','#ececec','#ecf0f1','#a2ded0'];
    var stars = 250;

    for (var i = 0; i <= stars; i++) {

      var size = Math.random()*3;
      var color = cols[parseInt(Math.random()*4)];

      $('#starsBox').prepend('<span style=" width: ' + size + 'px; height: ' + size + 'px; top: ' + Math.random()*100 + '%; left: ' + Math.random()*100 + '%; background: ' + color + '; box-shadow: 0 0 '+ Math.random()*10 +'px' + color + ';"></span>') ;
    };

    setTimeout(function(){ 
      $('#starsBox span').each(function(){  
      $(this).css('top', Math.random()*100 + '%').css('left', Math.random()*100 + '%'); 
    });
    }, 1);

    setInterval(function(){ 
      $('#starsBox span').each(function(){  	
      $(this).css('top', Math.random()*100 + '%').css('left', Math.random()*100 + '%'); 
    });
    }, 100000); 
  }

  createBoard() {
    let board = [];

    for (let i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (let j = 0; j < this.props.ncols; j++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }

    return board;
  }
  
  // onClick event handler to reset game
  resetGame() {
    this.setState({
      hasWon: false,
      board: this.createBoard()
    })
  }
  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);


    // if this coordinate is on board, flip it
    function flipCell(y, x) {
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // Flip initial cell
    flipCell(y, x);
    
    // Flip top and bottom cells
    flipCell(y-1, x);
    flipCell(y+1, x);

    // Flip left and right cells
    flipCell(y, x-1);
    flipCell(y, x+1);

    let hasWon = board.every(row => row.every(cell => !cell));

    this.setState({board, hasWon});
  }

  // Create the game board and populate lit cells
  makeTable() {
    let tblBoard = [];
    for (let i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (let j = 0; j < this.props.ncols; j++) {
        let coord= `${j}-${i}`
        row.push(<Cell 
          key = {coord}
          className="Cell" 
          isLit = {this.state.board[j][i]}
          flipCellsAroundMe={() => this.flipCellsAround(coord)}
        ></Cell>);
      }
      tblBoard.push(<tr key={i}>{row}</tr>);
    }
    return tblBoard;
  }
  
  /** Render game board or winning message. */
  render() {
    return (
      <div>
        {this.state.hasWon ? (
          <div className="winner">
            <span className="glow-orange">YOU&nbsp;</span>
            <span className="glow-blue">WIN!</span>
            <div>
              <button 
                className="button light"
                onClick={this.resetGame}
              >
                Play again?
              </button>
            </div>
          </div>
        ) : (
          <div id="starsBox">
            <div className="Board-title">
              <div className="glow-orange">Lights&nbsp;</div>
              <div className="glow-blue">Out</div>
            </div>
            <table className="Board">
              <tbody>{this.makeTable()}</tbody> 
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Board;