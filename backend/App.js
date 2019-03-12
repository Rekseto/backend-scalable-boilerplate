const Koa = require("koa");
const Router = require("koa-router");
const db = require("./database");
const callDir = require("call-dir");
const path = require("path");

async function initServer(config) {
  const app = new Koa();
  const database = await db.initDatabase(config, console);
  const router = new Router();
  const logger = console;

  const routes = path.resolve(__dirname, "./routes");
  callDir.loadAll(routes, fpath =>
    require(fpath)(router, { database, logger })
  );

  app.use(router.routes()).use(router.allowedMethods());
  console.log("App listens on" + config.PORT);
  app.listen(config.PORT);
}

initServer(process.env);
