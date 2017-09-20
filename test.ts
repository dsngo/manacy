function timeAtOffset(o?: number): string {
    return (o !== undefined ? new Date(o) : new Date()).toISOString();
}

const a = timeAtOffset();
console.log(a); // tslint:disable-line
const b = timeAtOffset(0);
console.log(b); // tslint:disable-line
