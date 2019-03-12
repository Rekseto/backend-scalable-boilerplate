module.exports = function(router, { databae, logger }) {
  router.get("/test/", (ctx, next) => {
    console.log("I just got request");
    ctx.body = {
      success: true
    };
  });

  router.get("/", (ctx, next) => {
    console.log("I just got request");
    ctx.body = {
      success: true
    };
  });
};
