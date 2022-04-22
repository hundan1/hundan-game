import Pool from './base/pool'

let instance
const CHESS_WIDTH = 50
const CHESS_HEIGHT = 50

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.chess_w = CHESS_WIDTH;
    this.chess_h = CHESS_HEIGHT;
    this.mode = 0; // 游戏模式 0人机 1双人
    this.gameOver = false;
    this.turn = 0; // 当前回合 0 初始化 1 玩家一回合 2 玩家二回合
    this.board = [
      [2,2,2],
      [0,0,0],
      [1,1,1]
    ];// 棋盘
  }
}
