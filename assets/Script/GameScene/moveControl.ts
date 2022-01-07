// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

   @property(cc.Node)
   move1: cc.Node = null;
   
   @property(cc.Node)
   move2: cc.Node = null;
   
   @property
   speed: number = 100;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.triggerX = -this.move1.width;
	}

    start () {

    }

    update (dt) {
		this.move1.x -= this.speed * dt;
		this.move2.x -= this.speed * dt;
		
		if(this.move1.x <= this.triggerX) {
			this.move1.x = this.move2.x + this.move1.width;
		}else if(this.move2.x <= this.triggerX) {
			this.move2.x = this.move1.x + this.move1.width;
		}
	}
	
}
