'use strict';

class Menu{
	constructor(UI){
		this.UI = UI;
	}
	hide(){this.element.style.display = 'none'}
	display(){this.element.style.display = 'flex'}
}

class StartMenu extends Menu{
	constructor(UI){
		super(UI);
		this.element = document.getElementById('startMenu');
		this.eventHandler();
	}
	eventHandler(){
		this.element.addEventListener('click', (event)=>{
			let target = event.target.closest('.btn');
			if(target){
				if(target.id === 'settingsBtn'){this.UI.currMenu = this.UI.settingsMenu;}
				else if(target.id === 'startBtn'){this.UI.startGame()}
			}
		});
	}
}

class SettingsMenu extends Menu{
	constructor(UI){
		super(UI);
		this.element = document.getElementById('settingsMenu');
		this.eventHandler();
	}
	eventHandler(){
		this.element.addEventListener('click', (event)=>{
			let target = event.target.closest('.click');
			if(target){
				if(target.id === 'back'){
					this.UI.currMenu = this.UI.startMenu;
					this.UI.renderMenu();
				}else{
					if(target.id == 'difficultyKey'){
						let currLvl = Number(document.querySelector(`#${target.id}>.key`).textContent);
						currLvl = currLvl >= 3 ? 1 : currLvl+1;
						this.UI.game.difficulty = currLvl;
						document.querySelector(`#${target.id}>.key`).textContent = currLvl;
					}else{
						this.UI.currMenu = this.UI.keySelectMenu;
						this.UI.currMenu.action = target.id;
						this.UI.renderMenu();
					}
				}
			}
		});		
	}
}

class GameOverMenu extends Menu{
	constructor(UI){
		super(UI);
		this.element = document.getElementById('gameOverMenu');
		this.eventHandler();
	}
	eventHandler(){
		this.element.addEventListener('click', (event)=>{
			let target = event.target.closest('.btn');
			if(target){
				if(target.id === 'gameOverBtn'){this.UI.currMenu = this.UI.startMenu;}
			}
		});
	}
}

class KeySelectMenu extends Menu{
	constructor(UI){
		super(UI);
		this.action;
		this.element = document.getElementById('keySelectMenu');
		this.eventHandler();
	}
	eventHandler(){
		function handler(event){
			if(this.action){
				// CHECK IF KEY CHOICE IS ALREADY BOUND IF TRUE SWAP BINDINGS
				for(let [property, value] of Object.entries(this.UI.game.ctrlObj)){
					if(event.code == value){
						[this.UI.game.ctrlObj[property], this.UI.game.ctrlObj[this.action]] 
						= [this.UI.game.ctrlObj[this.action], this.UI.game.ctrlObj[property]]
						document.querySelector(`#${property}>.key`).textContent = this.UI.game.ctrlObj[property]
					}
				}
				this.UI.game.ctrlObj[this.action] = event.code;
				document.querySelector(`#${this.action}>.key`).textContent = event.code;
				this.UI.currMenu = this.UI.prevMenu;
				this.action = null;
			}
		}
		handler = handler.bind(this);
		document.addEventListener('keypress', handler);

	}
}