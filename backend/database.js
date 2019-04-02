const mongoose = require("mongoose");
const callDir = require("call-dir");
const path = require("path");
/**
 * @example Using models
 * const User = db.get("user");
 *
 *
 * @class   {Database}
 * @export  {Database}
 * @access  public
 */

class Database {
  /**
   * Imported models.
   *
   * @type    {Object}
   * @access  private
   */

  /**
   * Connection to database.
   *
   * @access  public
   */

  /**
   * Creates a connection to a database.
   *
   * @param   {Object}    config              Configuration object
   * @param   {string}    config.host         Database host
   * @param   {string}    config.port         Database port
   * @param   {string}    config.username     Database username
   * @param   {string}    config.password     Database password
   * @param   {string}    config.database     Database name
   */
  constructor(config = {}, { logger }) {
    this.models = {};
    this.connection = null;
    this.config = config;
    this.mongoose = mongoose;
    this.logger = logger;
  }

  /**
   * Connects to a database and loads all the models.
   *
   * @return  {Promise}
   * @access  private
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME } = this.config;
        // Using docker link is more safer than using DB_HOST
        this.mongoose.connect(`mongodb://mongo:${DB_PORT}/${DB_NAME}`, {
          useNewUrlParser: true
        });
        this.connection = mongoose.connection;

        resolve(this.mongoose);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Loads a model and saved it for further usage.
   *
   * @param   {string}  resource
   * @return  {void}
   * @access  public
   */
  load(resource) {
    this.models[resource.modelName] = this.mongoose.model(
      resource.modelName,
      resource.schema
    );
  }

  get(name) {
    if (!(name in this.models)) {
      // @todo create custom error class
      throw new Error(`Model "${name}" not defined`);
    }

    return this.models[name];
  }

  async startDatabase() {
    try {
      callDir.default(path.resolve(__dirname, "/models"), src => {
        this.load(require(src)(dependencies));
      });
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
    await this.connect();
  }
}

module.exports = Database;
