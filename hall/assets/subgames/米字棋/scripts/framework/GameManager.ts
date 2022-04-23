const { ccclass, property } = cc._decorator;
import Border from "../border/Border";
import Chess from "../chess/Chess";
import Constant from "./Constant";
@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Label)
    roundLabel: cc.Label = null!;

    @property(cc.Prefab)
    boardPrfb: cc.Prefab = null!;
    @property(cc.Prefab)
    borderPrfb: cc.Prefab = null!;
    @property(cc.Prefab)
    chessXPrfb: cc.Prefab = null!;
    @property(cc.Prefab)
    chessOPrfb: cc.Prefab = null!;

    BOARD_NODE: cc.Node = null!;

    BOARD_SCALE: number = 1;
    CHESS_SCALE: number = 2;
    BOARD_SIZE = 560;
    CHESS_SIZE = 32;

    round: number = Constant.CHESS.O;// 当前回合
    board: Array<number> =
        [
            2, 2, 2,// x x x
            0, 0, 0,
            1, 1, 1
        ];
    chesses: Array<cc.Node> = [];
    borders: Array<cc.Node> = [];
    gamestate: number = Constant.GAME_STATE.PLAYING;
    currChessIndex: number = -1;


    onLoad() {
    }

    start() {
        let canvas = cc.find("Canvas");
        let size = canvas.getContentSize();
        let W = size.width;
        let H = size.height;
        this.BOARD_SCALE = Math.round(W / 640);
        this.CHESS_SCALE = Math.round(W / 640) * 2;
        this.BOARD_SIZE *= this.BOARD_SCALE;
        this.CHESS_SIZE *= this.CHESS_SCALE;
        // cc.log(`canvas size: ${W} BOARD_SCALE: ${this.BOARD_SCALE} CHESS_SCALE: ${this.CHESS_SCALE} BOARD_SIZE: ${this.BOARD_SIZE}  CHESS_SIZE: ${this.CHESS_SIZE}`);


        this.generateBoard();
        this.generateChess();
    }

    generateBoard() {
        let node = cc.instantiate(this.boardPrfb);
        node.setScale(this.BOARD_SCALE);
        node.setPosition(0, 0, 0);
        node.parent = cc.find("Canvas");
        this.BOARD_NODE = node;
    }

    generateChess() {
        for (let i = 0; i < this.board.length; i++) {
            let c = this.board[i];
            let m = Math.floor(i / 3);
            let n = i % 3;
            cc.log(`m: ${m} n: ${n}`);
            let node = null;
            let border = cc.instantiate(this.borderPrfb);
            let b_s: Border = border.getComponent(Border);
            b_s.init(this, m, n);
            let x = (n - 1) * (this.BOARD_SIZE) / 2;
            let y = (1 - m) * (this.BOARD_SIZE) / 2;
            border.setScale(this.CHESS_SCALE);
            border.parent = this.BOARD_NODE;
            border.setPosition(x, y, 0);
            border.active = false;
            this.borders[i] = border;



            if (c === Constant.CHESS.O) {
                node = cc.instantiate(this.chessOPrfb);
                let s: Chess = node.getComponent(Chess);
                s.init(this, m, n, this.chesses.length);
                s.type = Constant.CHESS.O;
            } else if (c === Constant.CHESS.X) {
                node = cc.instantiate(this.chessXPrfb);
                let s: Chess = node.getComponent(Chess);
                s.init(this, m, n, this.chesses.length);
                s.type = Constant.CHESS.X;
            } else {
                // this.chesses[i] = null;
                continue;
            }

            node.setScale(this.CHESS_SCALE);
            node.parent = this.BOARD_NODE;
            node.setPosition(x, y, 0);
            this.chesses[this.chesses.length] = node;
            // this.chesses[i] = node;
            cc.log(x, y);

            // cc.log("chess X", node);
        }
    }

    /**
     * 选子或切子
     */
    chooseChess(chess: Chess) {
        this.currChessIndex = chess.index;

        this.chesses.forEach(item => {
            let s = item.getComponent(Chess);
            if (s.type == chess.type) {
                s.isCheck = false;
            }
        });
        chess.isCheck = true;

        let showBorders = this.calcVaildBorder(chess.m, chess.n);
        this.borders.forEach((item, i) => {
            if (showBorders.includes(i)) {
                item.active = true;
            } else {
                item.active = false;
            }

        });
    }

    /**
     * 落子
     * @param border 
     */
    playChess(border: Border) {
        if (this.currChessIndex === -1) return;
        cc.log(`currChessIndex: ${this.currChessIndex}`);
        let currChess = this.chesses[this.currChessIndex];
        let c_s: Chess = currChess.getComponent(Chess);

        let m = border.m;
        let n = border.n;
        let x = (n - 1) * (this.BOARD_SIZE) / 2;
        let y = (1 - m) * (this.BOARD_SIZE) / 2;
        currChess.setPosition(x, y, 0);

        this.borders.forEach(item => {
            if (item.active) {
                item.active = false;
            }
        });

        let pos_i = c_s.m * 3 + c_s.n;
        this.board[pos_i] = 0;
        this.board[m * 3 + n] = c_s.type;
        c_s.m = m;
        c_s.n = n;

        c_s.isCheck = false;
        this.currChessIndex = -1;

        this.checkWin();
    }

    /**
     * 判断是否胜利
     */
    checkWin() {
        let round = this.round;
        let v = Math.pow(round, 3);
        let isWin = (this.board[0] * this.board[3] * this.board[6] === v) || (this.board[1] * this.board[4] * this.board[7] === v) || (this.board[2] * this.board[5] * this.board[8] === v) || (this.board[0] * this.board[4] * this.board[8] === v) || (this.board[2] * this.board[4] * this.board[6] === v) || (this.board[3] * this.board[4] * this.board[5] === v);

        if (!isWin) {
            if (round === Constant.CHESS.X && (this.board[6] * this.board[7] * this.board[8] === v)) {
                isWin = true;
            } else if (round === Constant.CHESS.O && (this.board[0] * this.board[1] * this.board[8] === 2)) {
                isWin = true;
            }
        }


        if (isWin) {
            cc.log(`${round === Constant.CHESS.X ? "X" : "O"} is win!!!`);

            this.reset();
        } else {
            this.next();
        }
    }

    next() {
        if (this.round === Constant.CHESS.O) {
            this.round = Constant.CHESS.X;
            this.roundLabel.string = "回合：" + "X";
        } else {
            this.round = Constant.CHESS.O;
            this.roundLabel.string = "回合：" + "O";
        }

    }


    reset() {
        this.roundLabel.string = "回合：" + "O";
        this.round = Constant.CHESS.O;

        this.board =
            [
                2, 2, 2,
                0, 0, 0,
                1, 1, 1
            ];


        this.currChessIndex = -1;
        this.chesses.forEach(chess => {
            let s = chess.getComponent(Chess);
            s.reset();
            let x = (s.n - 1) * (this.BOARD_SIZE) / 2;
            let y = (1 - s.m) * (this.BOARD_SIZE) / 2;
            chess.setPosition(x, y);
        });

        this.borders.forEach(border => {
            if (border.active) {
                border.active = false;
            }
        });

        this.gamestate = Constant.GAME_STATE.PLAYING;
    }


    /**
     * 计算可落子区域
     */
    // calcVaildBorder(chess: Chess) {
    calcVaildBorder(m: number, n: number) {
        let getBorder = this.getBorderByPos(m, n);
        let res = [];
        getBorder.forEach(item => {
            if (this.board[item] === 0) {
                res[res.length] = item;
            }
        });
        return res;
    }

    getBorderByPos(m, n): Array<number> {
        /**
         *     0   1   2
         * 
         *  0  0 - 1 - 2
         *     | \ | / |
         *  1  3 - 4 - 5
         *     | / | \ |
         *  2  6 - 7 - 8
         */
        if (m == 0 && n == 0) {
            return [1, 3, 4];
        } else if (m == 0 && n == 1) {
            return [0, 2, 4];
        } else if (m == 0 && n == 2) {
            return [1, 4, 5];
        }

        else if (m == 1 && n == 0) {
            return [0, 4, 6];
        } else if (m == 1 && n == 1) {
            return [0, 1, 2, 3, 5, 6, 7, 8];
        } else if (m == 1 && n == 2) {
            return [2, 4, 8];
        }

        else if (m == 2 && n == 0) {
            return [7, 3, 4];
        } else if (m == 2 && n == 1) {
            return [6, 8, 4];
        } else if (m == 2 && n == 2) {
            return [7, 4, 5];
        }
    }
    // update (dt) {}
}
