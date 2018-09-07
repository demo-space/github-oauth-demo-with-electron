const router = require('koa-router')()
const fetch = require('node-fetch')
const querystring = require('querystring')

router.prefix('/api')

function getUserinfo(token) {
  return new Promise(resolve => {
    // fetch('https://api.github.com/user?access_token=' + token, {
    fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "token " + token
      }
    })
    .then(res => {
      resolve(res.json())
    })
    .catch(e => {
      console.log(e)
    })
  })
}

router.get('/getUserinfo', async (ctx, next) => {
  const token = ctx.query.token
  const res = await getUserinfo(token)
  ctx.body = {status: 0, data: res}
})

module.exports = router