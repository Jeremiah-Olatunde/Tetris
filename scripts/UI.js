'use strict';

class UIClass{
	constructor(){
		this.startMenu = new StartMenu(this);
		this.settingsMenu = new SettingsMenu(this);
		this.gameOverMenu = new GameOverMenu(this); 
		this.keySelectMenu = new KeySelectMenu(this); 
		this.game = new Game(this);
		this._currMenu;
		this.intializeUI();
	}
	get currMenu(){return this._currMenu}
	set currMenu(value){
		this.prevMenu = this._currMenu;
		this._currMenu = value;
		this.renderMenu();
	}

	intializeUI(){
		this.currMenu = this.startMenu;
		this.renderMenu();
	}

	renderMenu(hideAll = false){
		this.prevMenu?.hide();
		this.currMenu?.display();
	}

	startGame(){
		this.currMenu.hide();
		this.game.intializeGame();
	}

	updateScore(){
		let scoreBoard = document.getElementById('scoreBoard');
		scoreBoard.textContent = `SCORE : ${this.game.score}`;
		this.gameOverMenu.element.querySelector('.body').textContent = `SCORE : ${this.game.score}`;
	}

	terminateGame(){
		this.currMenu = this.gameOverMenu;
		this.renderMenu();
	}
}

let UI = new UIClass()