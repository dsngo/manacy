const a = {b: 1, c: 2};
const d = {e: 3, f: 4};

const {...g} = {a, d};
const h = {...a, ...d};

console.log(g, h); // tslint:disable-line
