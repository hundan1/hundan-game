import Sprite from '../base/sprite'
import DataBus from '../databus'

const CHESS_O_IMG_SRC = 'images/chess_O.png'
const CHESS_X_IMG_SRC = 'images/chess_X.png'

const __ = {
  speed: Symbol('speed')
}

const databus = new DataBus()
const CHESS_WIDTH = databus.chess_w
const CHESS_HEIGHT= databus.chess_h

export default class Chess extends Sprite {
  constructor(type = 1) {
    super(type == 1 ? CHESS_O_IMG_SRC : CHESS_X_IMG_SRC, CHESS_WIDTH, CHESS_HEIGHT)
    this.type = type;
  }

  /**
   * 
   * @param {*} x 初始棋子水平位置
   * @param {*} y 初始棋子垂直位置
   * @param {*} m 数据
   * @param {*} n 
   */
  init(x, y, m , n) {
    this.setChessPos(x,y);
    this.m = m;
    this.n = n;
    // this[__.speed] = speed;
    this.visible = true;
    this.isSelected = false; 
  }

  // 移动棋子
  moveTo(x, y, m, n) {
    // console.log(x,y,m,n);
    let chess = databus.board[this.m].splice(this.n,1,0)[0];
    databus.board[m][n] = chess;
    this.m = m;
    this.n = n;
    this.setChessPos(x,y);
  }


  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在旗子上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在旗子上的布尔值
   */
  checkIsFingerOnChess(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation &&
      y >= this.y - deviation &&
      x <= this.x + this.width + deviation &&
      y <= this.y + this.height + deviation)
  }

  /**
   * 设置落子位置
   */
  setChessPos(x,y){
    this.x = x - CHESS_WIDTH / 2;
    this.y = y - CHESS_HEIGHT / 2;
  }

}