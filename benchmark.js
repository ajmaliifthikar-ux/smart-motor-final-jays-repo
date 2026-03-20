const { performance } = require('perf_hooks');

const n = 100000;

performance.mark('start-inline');
for (let i = 0; i < n; i++) {
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(i);
}
performance.mark('end-inline');
performance.measure('Inline Instantiation', 'start-inline', 'end-inline');

const formatter = new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 });
performance.mark('start-hoisted');
for (let i = 0; i < n; i++) {
  formatter.format(i);
}
performance.mark('end-hoisted');
performance.measure('Hoisted Instantiation', 'start-hoisted', 'end-hoisted');

const measures = performance.getEntriesByType('measure');
for (const measure of measures) {
  console.log(`${measure.name}: ${measure.duration.toFixed(2)}ms`);
}
