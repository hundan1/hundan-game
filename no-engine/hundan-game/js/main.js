import DataBus from './databus';
import Chess from './player/chess.js';
import Board from './runtime/board.js';

let ctx = canvas.getContext('2d')
let databus = new DataBus()
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const CHESS_WIDTH = databus.chess_w;
const CHESS_HIGHT = databus.chess_h;

const BOARD_WIDTH = screenWidth - CHESS_WIDTH - 10;
const BOARD_HIGHT = BOARD_WIDTH;
const BOARD_X = (screenWidth - BOARD_WIDTH) / 2;
const BOARD_Y = 46 + (screenHeight - 46 - 5 - BOARD_HIGHT) / 2;

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.touchHandler = null;
    this.menu_btn_1_area = null;
    this.menu_btn_2_area = null;
    this.init();
    this.restart();
  }
  init() {

  }

  restart() {
    databus.reset();

    this.board = new Board(ctx);

    // 订阅回合结束事件
    this.board.init({
      turnOverCb: this.turnOverHandler.bind(this)
    });

    databus.board.forEach((row, m) => {
      row.forEach((type, n) => {
        if (type != 0) {
          let chess = new Chess(type);
          let x = BOARD_X + n * BOARD_WIDTH / 2;
          let y = BOARD_Y + m * BOARD_HIGHT / 2;
          chess.init(x, y, m, n);
          row[n] = chess;
        }
      });
    });
    
    databus.turn = Math.ceil(Math.random() * 2);
    // console.log("currturn", databus.turn);
    // console.log(57,canvas);
    this.render();
  }

  render() {
    this.touchHandler && canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    );

    // this.renderMenu();
    this.renderBody();
  }

  // 渲染菜单
  renderMenu() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // bg
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    //  game__wrap
    ctx.fillStyle = "#333";

    ctx.strokeRect(5, 46, screenWidth - 10, screenHeight - 46 - 5);

    let menu_w = (screenWidth - 10) * 0.7;
    let menu_h = 0.75 * menu_w;
    let menu_x = (screenWidth - menu_w) / 2;
    let menu_y = screenHeight - 20 - menu_h;

    // menu
    // ctx.globalAlpha= 1;
    ctx.fillStyle = "#005792";
    ctx.fillRect(menu_x, menu_y, menu_w, menu_h);

    // btn1
    let btn_w = menu_w - 20;
    let btn_h = 40;
    let btn1_x = menu_x + 10;
    let btn1_y = menu_y + menu_h - btn_h - 10 - btn_h - 10;

    this.menu_btn_1_area = {
      startX: btn1_x,
      endX: btn1_x + btn_w,
      startY: btn1_y,
      endY: btn1_y + btn_h,
    };

    ctx.fillStyle = "#fc92e3";
    ctx.fillRect(btn1_x, btn1_y, btn_w, btn_h);

    // btn1_txt
    let btn1_txt_x = screenWidth / 2;
    let btn1_txt_y = btn1_y + (btn_h / 2);
    ctx.font = "20px Arial";
    let btn1_txt_max_w = btn_w - 10;
    ctx.fillStyle = "#f2f4c3";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      '人机对决',
      btn1_txt_x,
      btn1_txt_y,
      btn1_txt_max_w
    );

    // btn2
    let btn2_x = btn1_x;
    let btn2_y = btn1_y + btn_h + 10;
    ctx.fillStyle = "#fc92e3";
    ctx.fillRect(btn2_x, btn2_y, btn_w, btn_h);

    // btn2_txt
    let btn2_txt_x = screenWidth / 2;
    let btn2_txt_y = btn2_y + (btn_h / 2);
    ctx.font = "20px Arial";
    let btn2_txt_max_w = btn_w - 10;
    ctx.fillStyle = "#f2f4c3";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      '双人对决',
      btn2_txt_x,
      btn2_txt_y,
      btn2_txt_max_w
    );

    this.menu_btn_2_area = {
      startX: btn2_x,
      endX: btn2_x + btn_w,
      startY: btn2_y,
      endY: btn2_y + btn_h,
    };

    // console.log(this.menu_btn_1_area,this.menu_btn_2_area);
    this.touchHandler = this.menuBtnTouchEventHandler.bind(this);
    canvas.addEventListener('touchstart', this.touchHandler);
  }

  // 菜单按钮点击事件
  menuBtnTouchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area1 = this.menu_btn_1_area;
    let area2 = this.menu_btn_2_area;

    // console.log(x,y,area1,area2);
    if (x >= area1.startX &&
      x <= area1.endX &&
      y >= area1.startY &&
      y <= area1.endY) {
      this.startGame(0);
    } else if (x >= area2.startX &&
      x <= area2.endX &&
      y >= area2.startY &&
      y <= area2.endY) {
      this.startGame(1);
    }

  }

  /**
   * 开始游戏
   * @param {number} mode
   */
  startGame(mode) {
    databus.mode = mode;
    // console.log(mode);
  }

  //渲染游戏主体
  renderBody() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // bg
    ctx.fillStyle = "#f1f1f1";
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    //  game__wrap
    ctx.strokeStyle = "#333";
    ctx.strokeRect(5, 46, screenWidth - 10, screenHeight - 46 - 5);

    this.renderTurnInfo();

    // board
    this.renderBoard();
    this.renderChess();
  }

  renderBoard() {
    // board
    ctx.strokeStyle = "#32c46f";
    // let board_y = 46 + 5;
    ctx.strokeRect(BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HIGHT);

    ctx.beginPath();
    ctx.moveTo(BOARD_X, BOARD_Y);
    ctx.lineTo(BOARD_X + BOARD_WIDTH, BOARD_Y + BOARD_HIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(BOARD_X + BOARD_WIDTH, BOARD_Y);
    ctx.lineTo(BOARD_X, BOARD_Y + BOARD_HIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(BOARD_X + BOARD_WIDTH / 2, BOARD_Y);
    ctx.lineTo(BOARD_X + BOARD_WIDTH / 2, BOARD_Y + BOARD_HIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(BOARD_X, BOARD_Y + BOARD_HIGHT / 2);
    ctx.lineTo(BOARD_X + BOARD_WIDTH, BOARD_Y + BOARD_HIGHT / 2);
    ctx.stroke();
  }

  renderChess() {
    console.log('databus.board', databus.board);
    databus.board.forEach((row, m) => {
      row.forEach((item, n) => {
        item != 0 && item.drawToCanvas(ctx);
      });
    });
  }

  renderTurnInfo(){
    ctx.fillStyle = "#526c3f";
    ctx.font = "16px Arial";
    ctx.textAlign = "start";
    ctx.fillText(
      '回合:' + (databus.turn == 1 ? 'O' : 'X'),
      12,
      46 + 16 + 2,
    );
  }

  // 回合结束事件
  turnOverHandler() {
    let isOver = this.checkIsOver();
    if (isOver) {
      console.log('game over');
      this.renderBody();

      setTimeout(()=>{
        this.restart();
      },1000);
      
    } else {
      databus.turn = databus.turn == 1 ? 2 : 1;
      this.renderBody();
      console.log('curr turn', databus.turn);
    }
  }

  // 校验游戏是否结束
  checkIsOver() {
    let currTurn = databus.turn;
    let c0 = databus.board[0][0].type || 0;
    let c1 = databus.board[0][1].type || 0;
    let c2 = databus.board[0][2].type || 0;

    let c3 = databus.board[1][0].type || 0;
    let c4 = databus.board[1][1].type || 0;
    let c5 = databus.board[1][2].type || 0;

    let c6 = databus.board[2][0].type || 0;
    let c7 = databus.board[2][1].type || 0;
    let c8 = databus.board[2][2].type || 0;

    // 0 1 2
    // 3 4 5
    // 6 7 8

    let product = databus.turn * databus.turn * databus.turn;
    let sum = databus.turn + databus.turn + databus.turn;
    return !!((c0 + c4 + c8 == sum && c0 * c4 * c8 == product) || (c1 + c4 + c7 == sum && c1 * c4 * c7 == product) || (c2 + c4 + c6 == sum && c2 * c4 * c6 == product) || (c3 + c4 + c5 == sum && c3 * c4 * c5 == product) || (c0 + c3 + c6 == sum && c0 * c3 * c6 == product) || (c2 + c5 + c8 == sum && c2 * c5 * c8 == product));
  }
}