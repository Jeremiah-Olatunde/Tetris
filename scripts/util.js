'use strict';

class Random{
	static randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
	static scatter(baseArr, copy=true){
		baseArr = copy ? baseArr.slice() : baseArr;
		let baseLen = baseArr.length;
		for( let i=0; i<baseLen; i++ ){
			let randNo = Random.randInt(i, baseLen);
			[baseArr[i], baseArr[randNo]] = [baseArr[randNo], baseArr[i]];
		}
		return baseArr;
	}
}
