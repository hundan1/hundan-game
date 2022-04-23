import Constant from "../framework/Constant";
import GameManager from "../framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chess extends cc.Component {

    public m: number = 0;
    public n: number = 0;
    private _originM: number = 0;
    private _originN: number = 0;
    public index: number = 0;

    public type: number = Constant.CHESS.O;
    public isCheck: boolean = false;
    private _gm: GameManager = null;

    init(gm: GameManager, m: number, n: number, i: number) {
        this._gm = gm;

        this.m = m;
        this._originM = m;
        this.n = n;
        this._originN = n;

        this.index = i;
    }

    reset() {
        this.m = this._originM;
        this.n = this._originN;
        this.isCheck = false;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    protected onEnable(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    start() {

    }

    // 切子或选子
    onTouchEnded() {
        cc.log("chess touch end");
        if (this._gm.gamestate !== Constant.GAME_STATE.PLAYING || this.isCheck || this._gm.round !== this.type) {
            return;
        }
        this._gm.chooseChess(this);
        // this.isCheck = true;
    }

    protected onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    // update (dt) {}
}
