// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum States {
	Idle,
	Growth,
	End
}

export enum playerStates {
	Idle,
	Fall,
	Run,
	Appearing,
	Desappearing
}

export enum Animation {
	Idle = "Idle",
	Fall = "Fall",
	Run = "Run",
	Appearing = "Appearing",
	Desappearing = "Desappearing"
}

@ccclass
export default class NewClass extends cc.Component {
	
	@property({
		type: cc.Prefab,
		tooltip: "playerList"
	})
	playerList: cc.Prefab[] = [];
	
	@property({
		type: cc.Node,
		tooltip: "root node, move sence"
	})
	rootNode: cc.Node = null;

	@property({
		type: cc.Node,
		tooltip: "player node"
	})
	player: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "stick node"
	})
	stick: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "ground parent"
	})
	groundParent: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "current ground"
	})
	currentGround: cc.Node = null;
	
	@property({
		type: cc.Node,
		tooltip: "next ground"
	})
	nextGround: cc.Node = null;
	
	@property({
		type: cc.Prefab,
		tooltip: "ground prefab"
	})
	groundPrefab: cc.Prefab = null;
	
	@property({
		tooltip: "lenger speed"
	})
	speed: Number = 200;
	
	@property({
		tooltip: "player walk speed"
	})
	walkSpeed: Number = 200;
	
	@property({
		tooltip: "rotation time / angle time"
	})
	angleTime: cc.Float = 0.3;
	
	@property({
		tooltip: "stick right X"
	})
	stick_Rx: Number = 0;
	
	@property({
		tooltip: "is fall down boolean"
	})
	fallDown: boolean = false;
	
	@property({
		tooltip: "player move / rootNode move"
	})
	MoveApart: cc.Float = 0;
	
	@property({
		tooltip: "score label",
		type: cc.Label
	})
	scoreLable: cc.Label = null;
	
	@property({
		tooltip: "end node",
		type: cc.Node
	})
	endNode: cc.Node = null;
	
	@property({
		tooltip: "score"
	})
	private _score: Number = 0;
	
	get score() {
		return this._score;
	}
	
	set score(value) {
		if(value < 0) value = 0;
		this._score = value;
		this.scoreLable.string = "score: " + this._score;
	}
	
	state = States.Idle;
	
	playerState = playerStates.Idle;
	
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.initPlayer();
		this.initStick();
		let x = this.currentGround.x + this.currentGround.width / 2 - this.player.width / 4;
		this.stick.x = x;
		
		this.onTouch();
		this.endNode.active = false;
	}

    start () {
		this.endNode.active = false;
		playerIndex.score = 0;
    }

    update (dt) {
		switch(this.state) {
			case States.Growth:
				this.onGrowth(dt);
				break;
		}
		
		switch(this.playerState) {
			case playerStates.Idle:
				this.setAni(Animation.Idle);
				break;
			case playerStates.Run:
				this.setAni(Animation.Run);
				break;
			case playerStates.Fall:
				this.setAni(Animation.Fall);
				break;
		}
	}
	
	initPlayer() {
		let x = this.currentGround.x + this.currentGround.width / 2 - this.player.width / 4;
		let y = this.player.y;
		let parent = this.player.parent;
		this.player.destroy();
		this.player = cc.instantiate(this.playerList[playerIndex.index]);
		this.player.parent = parent;
		this.player.x = x;
		this.player.y = y;
		// cc.log(this.player.getComponent(cc.Animation));
	}
	
	initStick() {
		this.stick.height = 0;
		this.stick.angle = 0;
	}
	
	onTouch() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
	}
	
	onTouchStart() {
		if(this.state != States.Idle) {
			return;
		}
		this.state = States.Growth;
	}
	
	onTouchEnd() {
		if(this.state != States.Growth) {
			return;
		}
		this.state = States.End;
		
		this.onEnd();
	}
	
	onDestroy() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
	}
	
	onGrowth(dt) {
		this.stick.height += this.speed * dt;
		if(this.stick.height >= 500) {
			this.onTouchEnd();
		}
	}
	
	onEnd() {
		cc.tween(this.stick)
			.to(this.angleTime, {angle: -90})
			.start();
			
		this.scheduleOnce(this.onJudgment, this.angleTime);
	}
	
	onJudgment() {
		this.playerState = playerStates.Run;
		
		if(this.isSuccess()) {
			this.onSuccess();
		}else {
			this.onFailed();
		}
	}
	
	isSuccess() {
		let leftX = this.nextGround.x - this.nextGround.width / 2;
		let rightX = this.nextGround.x + this.nextGround.width / 2;
		// stick right x 坐标(平放后)
		this.stick_Rx = this.stick.x + this.stick.height;
		// 
		this.fallDown = this.stick_Rx < leftX;
		return this.stick_Rx > leftX && this.stick_Rx < rightX;
	}
	
	onSuccess() {
		// next ground edge
		let nextGroundEdge = this.nextGround.x + this.nextGround.width / 2 - this.player.width / 4;
		// player move Distance
		this.MoveApart = nextGroundEdge - this.player.x;
		let walkTime = this.MoveApart / this.walkSpeed;
		// move
		this.playerState = playerStates.Run;
		cc.tween(this.player)
			.to(walkTime, { position: cc.v2(nextGroundEdge, this.player.y) })
			.call(()=>{
				this.playerState = playerStates.Idle;
				this.score += 1;
				playerIndex.score = this.score;
			})
			.start();
		
		this.scheduleOnce(function() {
			this.onCreatePre();
		}, walkTime);
	}
	
	onCreatePre() {
		// instantiate prefab
		let newGround = cc.instantiate(this.groundPrefab);
		newGround.parent = this.groundParent;
		// math.random() width / size
		let width = 50 + Math.random() * 170;
		newGround.width = width;
		
		newGround.y = this.nextGround.y;
		let dis = 50 + Math.random() * 250;
		
		newGround.x = this.nextGround.x + this.nextGround.width/2 + dis + width/2;
		
		let time = this.MoveApart / (this.walkSpeed * 1.5);
		cc.tween(this.rootNode)
			.to(time, {position: cc.v2(this.rootNode.x -this.MoveApart, 0)})
			.start();
			
		this.scheduleOnce(function(){
			this.onDestoryOldGround(newGround);
		}, time);
		
		// cc.log(this.rootNode.x);
	}
	
	onDestoryOldGround(newGround) {
		// destroy 
		this.currentGround.destroy();
		
		this.currentGround = this.nextGround;
		
		this.nextGround = newGround;
		
		this.stick.x += this.MoveApart;
		
		this.initStick();
		
		this.state = States.Idle;
	}
	
	onFailed() {
		let _t = this;
		// 0 --> 1
		let walkLen = this.stick_Rx - this.player.x;
		let walkTime = walkLen / this.walkSpeed;
		this.playerState = playerStates.Run;
		cc.tween(this.player)
			.to(walkTime, {position: cc.v2(this.stick_Rx, this.player.y)})
			.call(()=>{
				this.playerState = playerStates.Idle;
			})
			.start();
			
		// player down
		this.scheduleOnce(function() {
			_t.playerState = playerStates.Fall;
			cc.tween(this.player)
				.to(2, {position: cc.v2(this.player.x, -1000)})
				.call(()=>{this.endNode.active = true;})
				.start();
				
			if(this.fallDown) {
				cc.tween(this.stick)
					.to(this.angleTime, {angle: -175})
					.start();
			}
		}, walkTime);
	}
	
	setAni(animation) {
		if(!animation || this.playerAni == animation) {
			return;
		}
		this.playerAni = animation;
		this.player.getComponent(cc.Animation).play(animation);
	}
}
