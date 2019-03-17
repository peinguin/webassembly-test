const STRING = "[dfsf]vcs [sfdfds]";
const REG1 = /\[([^\]]*)\]/g;
const REG2 = /\[([^\]]*?)\]/g;
const ITERATIONS = 1e4;
const PRINT = false;

const isNode = typeof process !== 'undefined';
const performance = isNode ? { now: Date.now } : window.performance;

(async function() {

	if (!isNode) {
		await getGo();
		await measure('internal loop', global.runInternalWasm);
		await check('webasm', global.runWasm);
	}
	await check('/\[([^\]]*)\]/g', str => str.match(REG1));
	await check('/\[([^\]]*?)\]/g', str => str.match(REG2));
	await check('mutable', forMutable);
	await check('immutable', forImmutable);
})().catch(console.error);

async function getGo() {
	const go = new Go();
	const result = await WebAssembly.instantiateStreaming(fetch("regexp.wasm"), go.importObject);
	go.run(result.instance);
}

function forMutable(str) {
	const res = [];
	const len = str.length;
	let b = false;
	let tmp = '';
	for (var i = 0; i < len; i++) {
		const c = str[i];
		if (!b && c === '[') {
			b = true;
			continue;
		}
		if (b && c === ']') {
			b = false;
			res.push(tmp);
			tmp = '';
			continue;
		}
		if (b) {
			tmp += c;
		}
	}
	return res;
}

function forImmutable(str) {
	const { res } = Array.from(str).reduce((acc, c) => {
		const { res, b, tmp } = acc;
		if (!b && c === '[') {
			return {
				tmp: '',
				b: true,
				res,
			};
		}
		if (b && c === ']') {
			return {
				b: false,
				tmp: '',
				res: res.concat(tmp),
			};
		}
		if (b) {
			return {
				b,
				tmp: tmp + c,
				res,
			};
		}
		return acc;
	}, { res: [], tmp: '', b: false });
	return res;
}

async function check(title, f) {
	return measure(title, async function () {
		for (var i = 0; i < ITERATIONS; i++) {
			const res = await f(STRING);
			if (PRINT) {
				console.log(res);
			}
		}
	});
}

async function measure(title, f) {
  const t0 = performance.now();
	await f();
	const t1 = performance.now();
	const diff1 = Math.round(t1 - t0) / 1e3;
	console.log(`Benchmark ${title} took ${diff1} seconds`);

}
