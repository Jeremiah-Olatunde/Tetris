'use strict';

class Grid{

	constructor(rowCount, colCount, gridWidth, gridHeight, grid){

		// INITIALIZE GRID DIMENSIONS
		[this.rowCount, this.colCount] = [rowCount, colCount];
		[this.gridWidth, this.gridHeight] = [gridWidth, gridHeight];
		[this.boxWidth, this.boxHeight] = [gridWidth/rowCount, gridHeight/colCount];
		this.boxCount = this.rowCount * this.colCount;

		// INITIALIZE GRID ELEMENT
		this.grid = grid;
		this.grid.style.width = `${this.gridWidth+6}px`;
		this.buildGrid();

	}

	getBox(coor){ return this.grid.querySelector(`[data-coor = '${coor.join()}']`)};

	buildGrid(){
		createBoxes.call(this).forEach(value => this.grid.append(...value));
		function createBoxes(){
			let gridArr = [];
			for( let y = 0; y < this.colCount; y++ ){
				let rowArr = [];
				for( let x = 0; x < this.rowCount; x++ ){
					let box = document.createElement('div');
					[box.style.width, box.style.height] = [`${this.boxWidth}px`, `${this.boxHeight}px`];
					[box.dataset.coor, box.className] = [`${x},${y}`, 'box'];
					rowArr.push(box);
				}
				gridArr.unshift(rowArr)
			}
			return gridArr;
		}
	}

	clearGrid(){
		Array.prototype.forEach
		.call(this.grid.children, value => {value.removeAttribute('data-block'); value.removeAttribute('data-ghost') });
	}

}

class MainGrid extends Grid{

	getRow(rowNo){
		let rowArr = [];
		for(let x=0; x<this.rowCount; x++){
			rowArr.push(this.getBox([x, rowNo]))
		}
		return rowArr;
	}
 
 	clearBlock(blockObj, clearBlock=true){

		let posArr = blockObj.constructBlock(blockObj.baseCoor);
		let finalArr = blockObj.constructBlock(blockObj.finalCoor);
		if(clearBlock){
			posArr.forEach(value => {
				let currBox = this.getBox(value);
				if(currBox) {currBox.removeAttribute('data-block');};
			})
		}	
		finalArr.forEach(value => {
			let currBox = this.getBox(value);
			if(currBox) {currBox.removeAttribute('data-ghost');}
		})

	}

	renderBlock(blockObj){
		let finalArr = blockObj.constructBlock(blockObj.finalCoor);
		let posArr = blockObj.constructBlock(blockObj.baseCoor);
		finalArr.forEach(value => {
			let currBox = this.getBox(value);
			if(currBox) {currBox.dataset.ghost = blockObj.blockName;}
		})
		posArr.forEach(value => {
			let currBox = this.getBox(value);
			if(currBox) {
				currBox.dataset.block = blockObj.blockName;
				currBox.removeAttribute('data-ghost');
			}
		})
	}

}

class SubGrid extends Grid{

	renderBlock(blockObj){
		this.clearGrid();
		let posArr = blockObj.constructBlock(blockObj.displayCoor);
		posArr.forEach(value => {
			let currBox = this.getBox(value);
			currBox.dataset.block = blockObj.blockName;
		})
	}

}