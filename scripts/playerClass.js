'use strict';

class Player{
	constructor(game, ctrlObj){
		this.game = game;
		this.btn = false;
		this.timeriD;
		this.ctrlObj = ctrlObj;
	}

	initializeHandler(){
		document.addEventListener('keypress', this.processInput);
	}

	terminateHandler(){
		document.removeEventListener('keypress', this.processInput);
	}

	processInput = (event) => {
		let keyCode = event.code;
		if(keyCode === this.ctrlObj.rightKey){this.game.moveBlock('right');}
		else if(keyCode === this.ctrlObj.leftKey){this.game.moveBlock('left');}
		else if(keyCode === this.ctrlObj.hardDropKey){this.game.moveBlock('hardDrop');}
		else if(keyCode === this.ctrlObj.holdKey){this.game.hold();}
		else if(keyCode === this.ctrlObj.rotateCWKey){this.game.rotate('CW');}
		else if(keyCode === this.ctrlObj.rotateCCWKey){this.game.rotate('CCW');}
		
		this.btn = true;
		clearTimeout(this.timeriD);
		this.timeriD = setTimeout(()=>{this.btn = false}, 200);		
	}

}

class Human extends Player{}
