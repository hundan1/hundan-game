import Constant from "../framework/Constant";
import GameManager from "../framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Border extends cc.Component {

    private _gm: GameManager = null;
    public m: number = 0;
    public n: number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(gm: GameManager, m: number, n: number) {
        this._gm = gm;
        this.m = m;
        this.n = n;
    }

    // start() {
    //     this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    // }

    protected onEnable(): void {
        // cc.log("border onEnable");
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    onTouchEnded() {
        cc.log("border touchend");
        if (this._gm.gamestate !== Constant.GAME_STATE.PLAYING && this.node.active == true) {
            return;
        }
        this._gm.playChess(this);

    }

    protected onDisable(): void {
        // cc.log("border onDisable");
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    // protected onDestroy(): void {
    //     this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    // }
    // update (dt) {}
}
