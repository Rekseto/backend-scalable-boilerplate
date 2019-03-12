module.exports = function ({database}) {
  const Schema = database.mongoose.Schema;

  const Test = new Schema({
    test: {type: String, required: true},
    created_at: Date,
    updated_at: Date
  });

  return {schema: Test, modelName: "Test"};
};
