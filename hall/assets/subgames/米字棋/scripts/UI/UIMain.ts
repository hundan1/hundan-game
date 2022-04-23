import GameManager from "../framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIMain extends cc.Component {

    @property(GameManager)
    gm: GameManager = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    protected onEnable(): void {
        
    }

    // onEvent() {
    //     this.gm.chesses.forEach(item => {
    //         item.on(cc.Node.EventType.TOUCH_START, this.onChessTouchStart, this);
    //     });
    //     this.gm.borders.forEach(item => {
    //         item.on(cc.Node.EventType.TOUCH_START, this.onBorderTouchEnd, this);
    //     });
    // }

    // offEvent() {
    //     this.gm.chesses.forEach(item => {
    //         item.on(cc.Node.EventType.TOUCH_START, this.onChessTouchStart, this);
    //     });
    //     this.gm.borders.forEach(item => {
    //         item.on(cc.Node.EventType.TOUCH_START, this.onBorderTouchEnd, this);
    //     });
    // }

    start() {

    }

    // // 棋子触摸事件
    // onChessTouchStart(e: cc.Event.EventTouch) {
    //     let node: cc.Node = e.currentTarget;
    //     cc.log(node);
    // }

    // // 落子点触摸事件（可取消）
    // onBorderTouchEnd() {

    // }


    // update (dt) {}
}
