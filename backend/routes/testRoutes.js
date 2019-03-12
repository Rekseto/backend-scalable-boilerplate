module.exports = function(router,{databae,logger}) {

router.get('/test/', (ctx,next) => {

 ctx.body = {
  success:true
 };

});

}
