'use strict';

class Block{

	constructor(baseCoor){
		this.baseCoor = baseCoor;
		this._orientation = 0;
		this.blockName = this.constructor.name;
	}

	get orientation(){return this._orientation}
	set orientation(value){this._orientation = value - (360*(Math.floor(value/360)))}

	rotate(startPoint){
		let posArr = this.constructDefault(startPoint).map(value =>{
			return [value[0] - startPoint[0], value[1] - startPoint[1]]
		}); // CONVERT ORGIN TO BASE COOR OF SHAPE
		for( let i=0; i<this.orientation/90; i++){
			posArr.forEach(value => [value[0], value[1]] = [-value[1], value[0]]) // ROTATE		
		} // ROTATE 
		let finalArr = posArr.map(value => {
			return [value[0] + startPoint[0] , value[1] + startPoint[1]];
		}) // CONVERT BACK TO ORGIN OF GRID

		return finalArr;			
	}

	constructBlock(startPoint){ return this.rotate(startPoint);}

}

class O extends Block{	
	constructor(baseCoor){
		super(baseCoor);
		this.displayCoor = [2,2]
	}
	constructDefault(startPoint){
		return	[ startPoint, 
				[ startPoint[0]+1, startPoint[1]+0 ],
				[ startPoint[0]+0, startPoint[1]+1 ],
				[ startPoint[0]+1, startPoint[1]+1 ]];
	}
	constructBlock(startPoint){
		return this.constructDefault(startPoint);
	}
}

class I extends Block{
	constructor(baseCoor){
		super(baseCoor);
		this.displayCoor = [2,2]
	}
	constructDefault(startPoint){
		return	[ startPoint,
				[ startPoint[0]-1, startPoint[1] ],
				[ startPoint[0]+1, startPoint[1] ],
				[ startPoint[0]+2, startPoint[1] ]];
	}
	constructBlock(startPoint){
		let posArr = super.constructBlock(startPoint);
		if(this.orientation == 90){this.translate('x', 1, posArr)}
		else if(this.orientation == 180){this.translate('both', [1,1], posArr)}
		else if(this.orientation == 270){this.translate('y', 1, posArr)}
		return posArr
	}
	translate(direction, amount, posArr){
		if(direction == 'x'){
			posArr.forEach(value => value[0] += amount)
		}else if(direction == 'y'){
			posArr.forEach(value => value[1] += amount)
		}else if('both'){
			posArr.forEach(value => value[0] += amount[0]);
			posArr.forEach(value => value[1] += amount[1])
		}
		return posArr;
	}
}

class S extends Block{
	constructor(baseCoor){
		super(baseCoor);
		this.displayCoor = [2,3]
	}
	constructDefault(startPoint){
		return	[ startPoint,
				[ startPoint[0]+1, startPoint[1]+0 ],
				[ startPoint[0]+0, startPoint[1]-1 ],
				[ startPoint[0]-1, startPoint[1]-1 ]];
	}
}

class Z extends Block{
	constructor(baseCoor){
		super(baseCoor);
		this.displayCoor = [3,3]
	}
	constructDefault(startPoint){
		return	[ startPoint,
				[ startPoint[0]-1, startPoint[1]+0 ],
				[ startPoint[0]+0, startPoint[1]-1 ],
				[ startPoint[0]+1, startPoint[1]-1 ]];		
	}
}

class T extends Block{
	constructor(baseCoor){
		super(baseCoor);
		this.displayCoor = [3,2]
	}
	constructDefault(startPoint){
		return 	[ startPoint,
				[ startPoint[0]+0, startPoint[1]+1 ],
				[ startPoint[0]-1, startPoint[1]+0 ],
				[ startPoint[0]+1, startPoint[1]+0 ]];
	}
}

class J extends Block{
	constructor(baseCoor){
		super(baseCoor);
		this.displayCoor = [2,2]
	}
	constructDefault(startPoint){
		return	[ startPoint,
				[ startPoint[0]-1, startPoint[1]+0 ],
				[ startPoint[0]-1, startPoint[1]+1 ],
				[ startPoint[0]+1, startPoint[1]+0 ]];
	}
}

class L extends Block{
	constructor(baseCoor){
		super(baseCoor);
		this.displayCoor = [2,2]
	}
	constructDefault(startPoint){
		return	[ startPoint,
				[ startPoint[0]-1, startPoint[1]+0 ],
				[ startPoint[0]+1, startPoint[1]+0 ],
				[ startPoint[0]+1, startPoint[1]+1 ]];
	}
}

class BlockQueue{
	constructor(size){
		this.size = size;
		this.seqGen = this.sequenceGenerator();
		this.buffer = this.sliceGen(size);
		this.currIdx = 0;
	}
	pop(){
		let value = this.buffer[this.currIdx];
		this.buffer[this.currIdx] = this.seqGen.next().value;
		this.currIdx = this.currIdx >= this.size-1 ? 0 : this.currIdx+1;
		return value;
	}
	peek(size){
		let endCount = this.size - this.currIdx;
		if(endCount < size){
			return [...this.buffer.slice(this.currIdx) , ...this.buffer.slice(0, size-endCount)];
		}else{return this.buffer.slice(this.currIdx, this.currIdx+size)}
	}

	sliceGen(size){
		let batchArr = [];
		for( let i = 0; i<size; i++){ batchArr.push(this.seqGen.next().value)}
		return batchArr;
	}

	*sequenceGenerator(){
		let blockBag = { 'I' : I, 'J' : J, 'L' : L, 'S' : S, 'Z' : Z, 'T' : T, 'O' : O }; 
		while(true){
			let currBag = Random.scatter(Object.keys(blockBag));
			for( let i of currBag ){yield new blockBag[i]([4,21])};
		}
	}
}