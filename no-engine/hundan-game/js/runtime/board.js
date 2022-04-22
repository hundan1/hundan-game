// import Sprite from '../base/sprite'
import DataBus from '../databus.js'


const databus = new DataBus()

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const CHESS_WIDTH = databus.chess_w;
const CHESS_HIGHT = databus.chess_h;

const BOARD_WIDTH = screenWidth - CHESS_WIDTH - 10;
const BOARD_HIGHT = BOARD_WIDTH;
const BOARD_X = (screenWidth - BOARD_WIDTH) / 2;
const BOARD_Y = 46 + (screenHeight - 46 - 5 - BOARD_HIGHT) / 2;

const BG_IMG_SRC = 'images/bg.jpg'
const BG_WIDTH = 512
const BG_HEIGHT = 512
/**
 * 游戏棋盘类
 * 提供选子、落子功能
 */
export default class Board {
  constructor(ctx) {
    // super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)
    this.choosed = false; // 是否选子了
    this.currChoosedChess = null;
    // 初始化事件监听
    this.initEvent();
  }
  init({
    turnOverCb = null
  }) {
    this.turnOverCb = turnOverCb;
  }
  static getCellAreaByMN(m, n) {
    let area = {
      startX: BOARD_X - 0.5 * CHESS_WIDTH + n * BOARD_WIDTH / 2,
      startY: BOARD_Y - 0.5 * CHESS_HIGHT + m * BOARD_HIGHT / 2,
    };
    area.endX = area.startX + CHESS_WIDTH;
    area.endY = area.startY + CHESS_HIGHT;
    return area;
  }
  static getCellPosByMN(m, n) {
    return {
      x: BOARD_X + n * BOARD_WIDTH / 2,
      y: BOARD_Y + m * BOARD_HIGHT / 2,
    }
  }
  checkIsFingerOnCell(x, y, m, n) {
    const deviation = 30
    let area = Board.getCellAreaByMN(m, n);
    // console.log(x, y, area);
    return !!(x >= area.startX &&
      x <= area.endX &&
      y >= area.startY &&
      y <= area.endY)
  }
  initEvent() {
    this.chooseChessBindHandler = this.chooseChessHandler.bind(this);
    this.playChessBindHandler = this.playChessHandler.bind(this);
    canvas.addEventListener('touchstart', this.chooseChessBindHandler);
  }
  // 选子事件函数
  chooseChessHandler(e) {
    e.preventDefault();
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    for (let m = 0; m < databus.board.length; m++) {
      let row = databus.board[m];
      for (let n = 0; n < row.length; n++) {
        let item = row[n];
        if (item != 0) {
          // console.log("choose chess item",item,databus.board);
          let currTurnType = databus.turn;
          if (item.checkIsFingerOnChess(x, y) && currTurnType == item.type) {
            console.log("choose chess");
            this.currChoosedChess = item;
            canvas.removeEventListener('touchstart', this.chooseChessBindHandler);
            canvas.addEventListener('touchstart', this.playChessBindHandler);
            this.choosed = true;
            return;
          }
        }
      }
    }
  }
  // 落子事件函数
  playChessHandler(e) {
    if (!this.choosed) return;
    console.log('落子');
    e.preventDefault();
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    for (let m = 0; m < databus.board.length; m++) {
      let row = databus.board[m];
      for (let n = 0; n < row.length; n++) {
        let item = row[n];
        let isOn = this.checkIsFingerOnCell(x, y, m, n);
        let currTurnType = databus.turn;
        // console.log('isOn', isOn);
        // console.log('currTurnType', currTurnType);
        // console.log('item', item);
        if (item != 0 && isOn && this.currChoosedChess.m == item.m && this.currChoosedChess.n == item.n) {
          console.log("选择自身");
          return;
        } else if (item != 0 && isOn && item.type == currTurnType) {
          // 切子
          this.currChoosedChess = item;
          console.log("切子",this.currChoosedChess);
          return;
        } else if (isOn && item == 0 && this.checkIsCanPlayChess(m, n)) {
          // 落子结束
          console.log("落子结束");
          let pos = Board.getCellPosByMN(m, n);
          this.currChoosedChess.moveTo(pos.x, pos.y, m, n);
          this.choosed = false;
          canvas.removeEventListener('touchstart', this.playChessBindHandler);
          this.turnOverCb && this.turnOverCb();
          canvas.addEventListener('touchstart', this.chooseChessBindHandler);
          return;
        }
      }

    }

  }

  // _m 目标 m _n 目标 n 
  checkIsCanPlayChess(_m, _n) {
    let m = this.currChoosedChess.m;
    let n = this.currChoosedChess.n;
    console.log(this.currChoosedChess,m,n,_m,_n);
    if (m == 0 && n == 0) {
      return (_m == 1 && _n == 0) || (_m == 1 && _n == 1) || (_m == 0 && _n == 1)
    } else if (m == 0 && n == 1) {
      return (_m == 0 && _n == 0) || (_m == 1 && _n == 1) || (_m == 0 && _n == 2)
    } else if (m == 0 && n == 2) {
      return (_m == 0 && _n == 1) || (_m == 1 && _n == 1) || (_m == 1 && _n == 2)
    } else if (m == 1 && n == 0) {
      return (_m == 0 && _n == 0) || (_m == 1 && _n == 1) || (_m == 2 && _n == 0)
    } else if (m == 1 && n == 1) {
      return !(_m == 1 && _n == 1)
    } else if (m == 1 && n == 2) {
      return (_m == 0 && _n == 2) || (_m == 1 && _n == 1) || (_m == 2 && _n == 2)
    } else if (m == 2 && n == 0) {
      return (_m == 1 && _n == 0) || (_m == 1 && _n == 1) || (_m == 2 && _n == 1)
    } else if (m == 2 && n == 1) {
      return (_m == 2 && _n == 0) || (_m == 1 && _n == 1) || (_m == 2 && _n == 2)
    } else if (m == 2 && n == 2) {
      return (_m == 2 && _n == 1) || (_m == 1 && _n == 1) || (_m == 1 && _n == 2)
    }
  }

  update() {
    databus.turn = databus.turn == 1 ? 2 : 1;
    canvas.addEventListener('touchstart', this.chooseChessBindHandler);
  }
}