// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Canvas extends cc.Component {
	
	@property({
		type: cc.Node,
		tooltip: "net scene btn"
	})
	startBtn: cc.Node = null;
	
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		cc.director.preloadScene("GameScene", function() {
			cc.log("next scene preload")
		})
		
		this.startBtn.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.startBtn.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.startBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
	}

    start () {
		
    }

    // update (dt) {}
	
	onTouchStart() {
		this.startBtn.setScale(1.1);
	}
	
	onTouchEnd() {
		this.startBtn.setScale(1);
		cc.director.loadScene("GameScene");
	}
	
	onTouchCancel() {
		this.startBtn.setScale(1);
	}
	
	onDestroy() {
		this.startBtn.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.startBtn.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.startBtn.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
	}
}
