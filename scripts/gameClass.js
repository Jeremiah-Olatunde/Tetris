'use strict';

class Game{

	constructor(UI){

		this.UI = UI
		// MIXINS
		this.renderDecorator()
		Object.assign(Object.getPrototypeOf(this), BlockCtrlMixin, BlockHelperMixin); 

		// INITIALIZE GRIDS
		this.mainGrid = new MainGrid( 10, 20, 250, 500, mainGridEl );
		this.holdGrid = new SubGrid( 6, 6, 150, 150, holdGridEl );
		this.nextGrid = new SubGrid( 6, 6, 150, 150, nextGridEl );	

		this.ctrlObj = {
			leftKey : 'KeyA',
			rightKey : 'KeyD',
			hardDropKey : 'Space',
			rotateCWKey : 'KeyR',
			rotateCCWKey : 'KeyE',
			holdKey : 'KeyC',
		};

		this.player = new Human(this, this.ctrlObj); // INITIALIZE PLAYER
		this.blockQ = new BlockQueue(7);	// INITIALIZE BLOCK QUEQE
		this.levels = new Map([[1,500], [2,200], [3,50]]);
		this.difficulty = 2

	}

	intializeGame(){
		this.mainGrid.clearGrid();
		this.holdGrid.clearGrid();
		this.nextGrid.clearGrid();

		this.player.initializeHandler();
		this.gameState = true;
		this.score = 0;
		this.blockInit();
		this.gravity = this.gravityOn();
	}

	blockInit(){
		this.currBlock = this.currBlock ? this.nextBlock : this.blockQ.pop();
		this.nextBlock = this.blockQ.pop();
		this.calcFinalCoor(this.currBlock);
	}

	scoring(){
		function recursiveSwap(block){
			let coor = block.dataset.coor.split(',').map(value => Number(value));
			let blockAbove = document.querySelector(`[data-coor = '${coor[0]},${1+coor[1]}']`);

			if(blockAbove != null){
				if(blockAbove.hasAttribute('data-block')){
					block.setAttribute('data-block', blockAbove.getAttribute('data-block'));
				}else{block.removeAttribute('data-block');}
				recursiveSwap(blockAbove);
			}
		}

		let rowCheck = (rowNo)=>{
			let row = this.mainGrid.getRow(rowNo);// CURRENT ROW
			let isFull = row.every(value => value.hasAttribute('data-block'));
			if(isFull){
				row.forEach(value => recursiveSwap(value));
				this.score += 100;
				rowCheck(rowNo)
			}
		}
		for(let x=0; x<this.mainGrid.rowCount; x++ ){rowCheck(x);}
		this.UI.updateScore();
	}

	gravityOn(){
		let recurse = ()=>{
			if(!this.player.btn){
				let validMove = this.moveBlock('down');
				if(!validMove){
					this.scoring();
					if(this.currBlock.baseCoor[1]>19) this.gameOver()
					else this.blockInit()
				}
			}
			if(this.gameState){
				this.gravity = setTimeout(recurse, this.levels.get(this.difficulty))
			}
		}
		// recurse = recurse.bind(this);
		this.gravity = setTimeout(recurse, 0);
	}

	gameOver(){
		this.gameState = false;
		this.currBlock = this.nextBlock = this.heldBlock = null;
		this.player.terminateHandler();
		this.UI.terminateGame();
	}

	renderGame(func){

		return function wrapper(...args){

			if(this.currBlock){
				args[0] === false ? this.mainGrid.clearBlock(this.currBlock,args[0])
								  : this.mainGrid.clearBlock(this.currBlock);
				this.holdGrid.clearGrid();
				this.nextGrid.clearGrid();
			}

			let rtn = func.call(this, ...args);
		
			if(this.currBlock){
				this.calcFinalCoor(this.currBlock);
				this.mainGrid.renderBlock(this.currBlock);
			}
			if(this.heldBlock){this.holdGrid.renderBlock(this.heldBlock);}
			if(this.nextBlock){this.nextGrid.renderBlock(this.nextBlock);}

			return rtn

		}

	}

	renderDecorator(){
		for(let renderProperty in BlockCtrlMixin){
			if(renderProperty.startsWith('render')){
				BlockCtrlMixin[renderProperty.slice(6)] = this.renderGame(BlockCtrlMixin[renderProperty]);
				delete BlockCtrlMixin[renderProperty];
			}
		}
	}

}