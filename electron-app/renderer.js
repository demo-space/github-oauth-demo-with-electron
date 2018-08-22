// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')
const token = localStorage.getItem('token')

// 之前已经用 GitHub 授权登录过了
if (token) {
  getUserInfo(token)
} else {
  ipcRenderer.send('no-token')
}

ipcRenderer.on('send-token', (event, token) => {
  console.log(token)
  localStorage.setItem('token', token)
  getUserInfo(token)
})

function getUserInfo(token) {
  fetch('http://localhost:3000/api/getUserinfo' + "?token=" + token, {
    method: 'get'
  }).then(res => {
    return res.json()
  }).then(res => {
    console.log(res)

    // token 过期
    if (res.data.message === 'Bad credentials') {
      localStorage.removeItem('token')
      location.reload()
    }

    const user = res.data
    document.querySelector('.user-info').innerHTML = 
    `
      <img src="${user.avatar_url}" class="avatars-img">
      ${user.name}
    `
  })
}

// 退出登录
document.querySelector('#logout-btn').onclick = () => {
  localStorage.removeItem('token')
  location.reload()
}