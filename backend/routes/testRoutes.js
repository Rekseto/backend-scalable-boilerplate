module.exports = function(router, { databae, logger }) {
  router.get("/", (ctx, next) => {
    ctx.body = {
      success: true
    };
  });
};
