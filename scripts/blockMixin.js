'use strict';

let BlockCtrlMixin = {

	renderhold(blockObj = this.currBlock){
		if(this.heldBlock){
			[this.heldBlock, this.currBlock] = [this.currBlock, this.heldBlock];
			this.currBlock.baseCoor = [4,21]
		}else{
			this.heldBlock = this.currBlock;
			this.currBlock = this.nextBlock;
			this.nextBlock = this.blockQ.pop();
		}
	},
	
	renderrotate(direction, blockObj = this.currBlock){
		let angle = direction == 'CW' ? -90 : +90;
		let valid = this.valCoor(blockObj, 0, angle)
		valid ? blockObj.orientation += angle : null;
		return valid;
	},

	rendermoveBlock(location, blockObj = this.currBlock){
		let nextCoor, coor;
		if(location == 'left'){nextCoor = [blockObj.baseCoor[0]-1, blockObj.baseCoor[1] ]}
		else if(location == 'right'){nextCoor = [blockObj.baseCoor[0]+1, blockObj.baseCoor[1] ]}
		else if(location == 'down'){nextCoor = [blockObj.baseCoor[0], blockObj.baseCoor[1]-1 ]}
		else if(location == 'hardDrop'){ nextCoor = blockObj.finalCoor }
		else if(location.constructor.name == 'Array'){nextCoor = location}
		
		let valid = this.valCoor(blockObj, nextCoor);
		valid ? blockObj.baseCoor = nextCoor : null;
		return valid
	},
}

let BlockHelperMixin = {

	valCoor(blockObj, nextPos, orientation){
		let posArr = blockObj.constructBlock(blockObj.baseCoor);
		let nextArr;

		if(nextPos){nextArr = blockObj.constructBlock(nextPos);}
		else if(orientation){
			let orgVal = blockObj.orientation;
			blockObj.orientation += orientation;
			nextArr =  blockObj.constructBlock(blockObj.baseCoor);
			blockObj.orientation = orgVal;
		}
		
		let isEmpty = nextArr.every(value => {
			let currBox = this.mainGrid.getBox(value);	
			let isTaken = Boolean(currBox?.hasAttribute('data-block'));
			let isPrev = (posArr.findIndex(curr => String(value) === String(curr))) !== -1; // TERRIBLE CODE
			return isPrev || !isTaken; 
		});

		let isOnGrid = nextArr.every(value=>{
			let xVal = (0 <= value[0] && value[0] <= 9);
			let yVal = (0 <= value[1] && value[1] <= 25);
			return xVal && yVal;	
		});

		return isOnGrid && isEmpty;

	},

	calcFinalCoor(blockObj = this.currBlock){

		let finalCoor = [blockObj.baseCoor[0], 0]; // SEARCH FROM LOWEST ROW BELOW SHAPE
		for( let i=0; i<21; i++){
			let valid = this.valCoor(blockObj, finalCoor);
			if(valid){break;}
			else{finalCoor = [finalCoor[0], finalCoor[1]+1];
			}
		}

		blockObj.finalCoor = finalCoor;
		return finalCoor;

	},

}

