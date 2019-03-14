const Koa = require("koa");
const Router = require("koa-router");
const db = require("./database");
const callDir = require("call-dir");
const path = require("path");
const winston = require("winston");

const levels = {
  log: 0,
  error: 1,
  critical: 2,
  info: 3
};



const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'log' }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info'
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ],
  levels
})


async function initServer(config) {
  const app = new Koa();
  const database = await db.initDatabase(config, console);
  const router = new Router();
  const logger = winstonLogger;

  logger.log('log', `BACKEND:${config.SERVER_ID} started`);

  const routes = path.resolve(__dirname, "./routes");
  callDir.loadAll(routes, fpath =>
    require(fpath)(router, { database, logger })
  );

  app.use(router.routes()).use(router.allowedMethods());
  console.log("App listens on" + config.PORT);
  app.listen(config.PORT);
}

initServer(process.env);
