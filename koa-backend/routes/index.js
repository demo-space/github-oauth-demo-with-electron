const router = require('koa-router')()

router.get('/app', async (ctx, next) => {
  await ctx.render('app', {})
})

router.get('/cb', async (ctx, next) => {
  await ctx.render('cb', {})
})

module.exports = router
