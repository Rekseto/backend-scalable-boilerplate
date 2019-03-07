const Koa = require('koa');
const Router = require('koa-router');
const db = require('./database');
const {loadAll} = require('call-dir');
const path = require('path');

async function initServer(config,db) {
const Database = await db.initDatabase(config);
const router = new Router();

const routes = path.resolve(__dirname, "./routes");
load(routes, fpath => require(fpath)(router,database));

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.PORT);
}


