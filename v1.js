const width = 512;
const height = 512;
const canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
let rows = 6;
let cols = 6;
let space = 5;
let cellSize = (width - space*(cols - 1))/cols;
let startX = 0;
let startY = 0;
let stride = cellSize + space;
let half = cellSize/2;
ctx.fillStyle = '#ddd';
ctx.lineCap = 'round';
const drawSquare1 = () => {
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(half, half, half/2, 0, Math.PI*2);
	ctx.moveTo(cellSize*0.1, cellSize*0.1);
	ctx.lineTo(cellSize*0.9, cellSize*0.9);
	ctx.closePath();
	ctx.stroke();
};
const drawSquare2 = () => {
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(half, half, half/2, 0, Math.PI*2);
	ctx.moveTo(cellSize*0.9, cellSize*0.1);
	ctx.lineTo(cellSize*0.1, cellSize*0.9);
	ctx.closePath();
	ctx.stroke();
};
for (let i=0; i<rows; ++i) {
	let y = i*stride + startY;
	for (let j=0; j<cols; ++j) {
		let x = j*stride + startX;
		ctx.setTransform(1, 0, 0, 1, x, y);
		ctx.fillRect(0, 0, cellSize, cellSize);
		ctx.beginPath();
		if ((i + j) % 2) {
			drawSquare2();
		} else {
			drawSquare1();
		}
	}
}
