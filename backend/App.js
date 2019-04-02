const Koa = require("koa");
const Router = require("koa-router");
const callDir = require("call-dir");
const path = require("path");
const { createLogger, format, transports } = require("winston");

const Database = require("./Database");
const Server = require("./Server");

const levels = {
  info: 0, // harmless actions
  notify: 1, // potential dangerous actions
  error: 2, // erros
  critical: 3 // criticals
};

const winstonLogger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({ level: "notify" }),
    new transports.Console({ level: "error" }),
    new transports.File({
      filename: "/var/project/logs/notify.log",
      level: "notify"
    }),
    new transports.File({
      filename: "/var/project/logs/info.log",
      level: "info"
    }),
    new transports.File({
      filename: "/var/project/logs/errors.log",
      level: "error"
    })
  ],
  levels
});
const server = new Server(process.env);

server.dependencies.logger = winstonLogger;
server.dependencies.database = new Database(server.config, server.dependencies);

const router = new Router();
const app = new Koa();

// app.use(...)
server.setEngine(app);

server.startServer(async function({ database, logger }, config) {
  const routes = path.resolve(__dirname, "./routes");

  try {
    await database.startDatabase();

    callDir.loadAll(routes, fpath =>
      require(fpath)(router, { database, logger })
    );

    app.use(router.routes()).use(router.allowedMethods());
  } catch (error) {
    logger.critical(error.message);
    throw error;
  }
});
