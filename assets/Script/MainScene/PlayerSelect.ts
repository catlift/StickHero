// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

window.playerIndex = {
	index: 0,
	score: 0
}

@ccclass
export default class NewClass extends cc.Component {

	@property({
		type: cc.Prefab
		tooltip: "playerList"
	})
	playerList: cc.Prefab[] = [];
	
	@property({
		type: cc.Node
		tooltip: "playerNode / player parent node"
	})
	playerNode: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "left change player"
	})
	leftBtn: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "right change player"
	})
	rightBtn: cc.Node = null;
	
	@property({
		tooltip: "player selectIndex"
	})
	private _selectIndex: Number = 0;
	
	@property
	get selectIndex() {
		return this._selectIndex;
	}
	
	set selectIndex(value) {
		if(value < 0) {
			value = 3;
		}else if(value > 3) {
			value = 0;
		}
		this._selectIndex = value;
	}

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		// init prefab
		this.initPlayerPrefab();
		// set player show
		this.setPlayerShow();
		
		// on btn
		this.onChangeBtn();
	}

    start () {

    }

    // update (dt) {}
	
	initPlayerPrefab() {
		for(let i = 0; i < this.playerList.length; i++ ) {
			let player = cc.instantiate(this.playerList[i]);
			player.parent = this.playerNode;
			let width = player.getContentSize().width;
			let height = player.getContentSize().height;
			player.setContentSize(width * 2, height * 2);
		}
	}
	
	setPlayerShow() {
		let player = this.playerNode.children[this.selectIndex];
		playerIndex.index = this.selectIndex;
		player.active = true;
		for(let i = 0; i < this.playerList.length; i++ ) {
			if(i != this.selectIndex) {
				this.playerNode.children[i].active = false;
			}
		}
	}
	
	onChangeBtn() {
		this.leftBtn.on(cc.Node.EventType.TOUCH_START, this.onLeftStart, this);
		this.leftBtn.on(cc.Node.EventType.TOUCH_END, this.onLeftEnd, this);
		this.leftBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.onLeftEnd, this);
		
		this.rightBtn.on(cc.Node.EventType.TOUCH_START, this.onRightStart, this);
		this.rightBtn.on(cc.Node.EventType.TOUCH_END, this.onRightEnd, this);
		this.rightBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.onRightEnd, this);
	}
	
	onLeftStart() {
		this.leftBtn.setScale(1.2);
		this.selectIndex -= 1;
		this.setPlayerShow();
	}
	
	onLeftEnd() {
		this.leftBtn.setScale(1);
	}
	
	onRightStart() {
		this.rightBtn.setScale(1.2);
		this.selectIndex += 1;
		this.setPlayerShow();
	}
	
	onRightEnd() {
		this.rightBtn.setScale(1);
	}
	
	onDestroy() {
		this.leftBtn.off(cc.Node.EventType.TOUCH_START, this.onLeftStart, this);
		this.leftBtn.off(cc.Node.EventType.TOUCH_END, this.onLeftEnd, this);
		this.leftBtn.off(cc.Node.EventType.TOUCH_CANCEL, this.onLeftEnd, this);
	}
}
