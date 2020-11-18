const Koa = require('koa');
const test = require('koa/lib/context');
const test2 = require('./koa/koa');

console.log(test, test2);

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
