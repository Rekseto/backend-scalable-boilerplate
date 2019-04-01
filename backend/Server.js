class Server {
  constructor(config) {
    this.config = config;

    this.dependencies = {
      logger: console
    };
    this.engine = null;
  }

  setEngine(engine) {
    this.engine = engine;
  }

  async startServer(cb) {
    const { logger } = this.dependencies;
    try {
      await cb(this.dependencies, this.config);
      logger.notify(`BACKEND:${this.config.SERVER_ID} started`);
      this.engine.listen(this.config.PORT);
    } catch (error) {
      this.dependencies.logger.critical(error.message);
      process.exit(1);
    }
  }
}

module.exports = Server;
