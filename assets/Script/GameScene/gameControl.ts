// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

	@property({
		type: cc.Label,
		tooltip: "score"
	})
	scoreLabel: cc.Label = null;
	
	@property({
		type: cc.Node,
		tooltip: "new score"
	})
	newScore: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "restart btn"
	})
	restartBtn: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "home btn"
	})
	homeBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.newScore.active = false;
		
		cc.director.preloadScene("MainScene", function() {
			cc.log("next scene preload")
		})
		
		this.onTouch();
		this.newText();
	}

    start () {
		
    }

    // update (dt) {}
	
	onTouch() {
		this.restartBtn.on(cc.Node.EventType.TOUCH_START, this.resTouchStart, this);
		this.restartBtn.on(cc.Node.EventType.TOUCH_END, this.resTouchEnd, this);
		this.restartBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.resTouchCancel, this);
		
		this.homeBtn.on(cc.Node.EventType.TOUCH_START, this.homeTouchStart, this);
		this.homeBtn.on(cc.Node.EventType.TOUCH_END, this.homeTouchEnd, this);
		this.homeBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.homeTouchCancel, this);
	}
	
	onDestroy() {
		this.restartBtn.off(cc.Node.EventType.TOUCH_START, this.resTouchStart, this);
		this.restartBtn.off(cc.Node.EventType.TOUCH_END, this.resTouchEnd, this);
		this.restartBtn.off(cc.Node.EventType.TOUCH_CANCEL, this.resTouchCancel, this);
		
		this.homeBtn.off(cc.Node.EventType.TOUCH_START, this.homeTouchStart, this);
		this.homeBtn.off(cc.Node.EventType.TOUCH_END, this.homeTouchEnd, this);
		this.homeBtn.off(cc.Node.EventType.TOUCH_CANCEL, this.homeTouchCancel, this);
	}
	
	resTouchStart() {
		this.restartBtn.setScale(1.1);
	}
	
	resTouchEnd() {
		this.restartBtn.setScale(1);
		cc.director.loadScene("GameScene");
	}
	
	resTouchCancel() {
		this.restartBtn.setScale(1);
	}
	
	
	homeTouchStart() {
		this.homeBtn.setScale(1.1);
	}
	
	homeTouchEnd() {
		this.homeBtn.setScale(1);
		cc.director.loadScene("MainScene");
	}
	
	homeTouchCancel() {
		this.homeBtn.setScale(1);
	}
	
	newText() {
		let score = playerIndex.score;
		this.scoreLabel.string = "score: " + score;
		let oldScore = cc.sys.localStorage.getItem("maxScore");
		cc.log(oldScore);
		if(score > oldScore) {
			cc.sys.localStorage.setItem("maxScore", score);
			this.newScore.active = true;
		}else {
			this.newScore.active = false;
		}
	}
}
