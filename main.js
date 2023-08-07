const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 80;
const cmSize = 14.85;
const cm = val => val*cellSize/cmSize;
const deg = val => val/180*Math.PI;
const space = 3;
const n = 6;
const size = cellSize*n + space*(n + 1);
canvas.width = size;
canvas.height = size;
const ini = - cellSize/2;
const end = cellSize/2;
const colors = {
	yellow: '#fc0',
	purple: '#73f',
};
const getCenter = (i) => space + cellSize/2 + (cellSize + space)*i;
const draw = ({ row, col, rot, mod }) => {
	const x = getCenter(col);
	const y = getCenter(row);
	ctx.fillStyle = '#fff';
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, x, y);
	ctx.rotate(rot*Math.PI/2);
	ctx.fillRect(ini, ini, cellSize, cellSize);
	ctx.beginPath();
	ctx.rect(ini, ini, cellSize, cellSize);
	ctx.clip();
	modules[mod]?.();
	ctx.restore();
};
const cornerTriangle = (side) => {
	ctx.beginPath();
	ctx.moveTo(ini, ini);
	ctx.lineTo(ini + side, ini);
	ctx.lineTo(ini, ini + side);
	ctx.fill();
};
const curvedCornerTriangle = (side) => {
	ctx.beginPath();
	ctx.arc(ini + side, ini + side, side, Math.PI, Math.PI*1.5);
	ctx.lineTo(ini, ini);
	ctx.fill();
};
const strangeShape1 = () => {
	ctx.beginPath();
	ctx.moveTo(end, ini);
	ctx.lineTo(end - cm(8), ini);
	ctx.lineTo(end - cm(6), ini + cm(2));
	ctx.lineTo(end, ini + cm(2));
	ctx.fill();
};
const sideTriangle = (side) => {
	const d = side*Math.SQRT2/2;
	ctx.beginPath();
	ctx.moveTo(ini, - d);
	ctx.lineTo(ini + d, 0);
	ctx.lineTo(ini, + d);
	ctx.fill();
};
const cornerCircle = (side) => {
	ctx.beginPath();
	ctx.arc(ini, ini, side, 0, Math.PI/2);
	ctx.lineTo(ini, ini);
	ctx.fill();
};
const losango = (side) => {
	const d = side*Math.SQRT2/2;
	ctx.beginPath();
	ctx.moveTo(ini + d, ini);
	ctx.lineTo(ini + d*2, ini + d);
	ctx.lineTo(ini + d, ini + d*2);
	ctx.lineTo(ini, ini + d);
	ctx.fill();
};
const sideSquare = (side) => {
	ctx.beginPath();
	ctx.moveTo(end, -side/2);
	ctx.lineTo(end, +side/2);
	ctx.lineTo(end - side, +side/2);
	ctx.lineTo(end - side, -side/2);
	ctx.fill();
};
const sideRect = (largeSide, smallSide) => {
	ctx.beginPath();
	ctx.moveTo(end, -largeSide/2);
	ctx.lineTo(end, +largeSide/2);
	ctx.lineTo(end - smallSide, +largeSide/2);
	ctx.lineTo(end - smallSide, -largeSide/2);
	ctx.fill();
};
const strangeShape2 = () => {
	const d = cellSize/2;
	const x = end - cm(8);
	const w = cm(2)*Math.SQRT2;
	ctx.beginPath();
	ctx.moveTo(x, ini);
	ctx.lineTo(x + d, 0);
	ctx.lineTo(x, end);
	ctx.lineTo(x - w, end);
	ctx.lineTo(x + d - w, 0);
	ctx.lineTo(x - w, ini);
	ctx.fill();
};
const diagonal = () => {
	const offset = cellSize;
	const w = cm(2);
	const d = w*Math.SQRT2;
	ctx.beginPath();
	ctx.moveTo(end - w, ini);
	ctx.lineTo(end - w - offset, ini + offset);
	ctx.lineTo(end - w - offset + d, ini + offset);
	ctx.lineTo(end - w + d, ini);
	ctx.fill();
};
const rotate = (n = 1) => {
	ctx.rotate(n*Math.PI/2);
};
const mirror = () => {
	ctx.transform(-1, 0, 0, 1, 0, 0);
};
const useColor = (name) => {
	ctx.fillStyle = colors[name];
};
const modules = [
	() => {
		useColor('yellow');
		strangeShape1();
		sideTriangle(cm(6));
		
		useColor('purple');
		mirror();
		rotate(2);
		strangeShape1();

		useColor('yellow');
		strangeShape2();
	},
	() => {
		useColor('purple');
		sideTriangle(cm(6));

		sideRect(cellSize, cm(2));
	},
];
const all = [];
const { localStorage } = window;
const allJSON = localStorage.getItem('all');
const store = () => {
	localStorage.setItem('all', JSON.stringify(all));
};
const shuffle = () => {
	all.forEach(item => {
		const rot = Math.floor(Math.random()*4);
		item.rot = rot;
		item.mod = Math.floor(Math.random()*modules.length);
	});
	store();
};
const randomRot = () => Math.random()*4|0;
const shuffleHalf = () => {
	const mods = [];
	const t = n**2;
	for (let i=0; i<t; ++i) {
		mods[i] = (i < t/2)*1;
	}
	for (let i=t;;) {
		const j = Math.random()*(i--)|0;
		const aux = mods[j];
		mods[j] = mods[i];
		mods[i] = aux;
		if (i <= 0) break;
	}
	for (let i=0; i<t; ++i) {
		all[i].mod = mods[i];
		all[i].rot = randomRot();
	}
	store();
};
const reset = () => {
	all.forEach(item => {
		item.rot = 0;
		item.mod = 0;
	});
	store();
};
if (!allJSON) {
	for (let row=0; row<n; ++row) {
		for (let col=0; col<n; ++col) {
			all.push({ row, col, rot: 0, mod: 0 });
		}
	}
} else {
	const parsed = JSON.parse(allJSON);
	all.push(...parsed);
}
const isInside = ({ row, col }, x, y) => {
	if (x < getCenter(col) + ini) return false;
	if (x > getCenter(col) + end) return false;
	if (y < getCenter(row) + ini) return false;
	if (y > getCenter(row) + end) return false;
	return true;
};
const render = () => {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.fillStyle = '#eee';
	ctx.fillRect(0, 0, size, size);
	all.forEach(draw);
};
const smooth = x => (1 - Math.cos(x*Math.PI))/2;
const smoothSqr = x => smooth(smooth(x));
const onClick = async (item) => {
	const rot0 = item.rot;
	const rot1 = rot0 + 1;
	await animate(t => {
		item.rot = (rot0 + smoothSqr(t)*(rot1 - rot0))%4;
	});
	item.rot = Math.round(item.rot)%4;
	store();
};
const onCtrlClick = (item) => {
	item.mod = (item.mod + 1)%modules.length;
	store();
};
const ACTION_CHANGE = 1;
const ACTION_ROTATE = 2;
let action = ACTION_ROTATE;
canvas.addEventListener('click', e => {
	const x = e.offsetX;
	const y = e.offsetY;
	const item = all.find(item => isInside(item, x, y));
	if (!item) return;
	if (action === ACTION_CHANGE) {
		onCtrlClick(item);
	}
	if (action === ACTION_ROTATE) {
		onClick(item);
	}
});
const frameLoop = () => {
	render();
	requestAnimationFrame(frameLoop);
};
frameLoop();
window.addEventListener('keydown', e => {
	const { code } = e;
	if (/^Digit\d$/.test(code)) {
		let i = Number(code.replace('Digit', '')) - 1;
		i = i < 0 ? 9 : i;
		if (i < modules.length) {
			all.forEach(item => {
				item.mod = i;
			});
			store();
		}
	}
	if (code === 'KeyS') {
		shuffle();
	}
	if (code === 'KeyR') {
		reset();
	}
	if (code === 'KeyH') {
		shuffleHalf();
	}
});
const duration = 250;
const animate = (fn) => new Promise(done => {
	const t0 = Date.now();
	const interval = setInterval(() => {
		const t1 = Date.now();
		const dt = t1 - t0;
		const t = Math.min(1, dt/duration);
		fn(t);
		if (t === 1) {
			clearInterval(interval);
			done();
		}
	}, 0);
});
document.querySelectorAll('button').forEach((button, i) => {
	button.addEventListener('click', () => {
		if (i === 0) {
			action = ACTION_ROTATE;
		}
		if (i === 1) {
			action = ACTION_CHANGE;
		}
		if (i === 2) {
			shuffleHalf();
		}
	});
});
