// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const fetch = require('node-fetch')
const {URL} = require('url')

// 来自 index.html，打开 oauth 窗口
ipcMain.on('no-token', function(event) {
  createAuthWindow()
})

// 来自 auth.html，打开 oauth url
ipcMain.on('oauth-login', function(event) {
  const authUrl = 'https://github.com/login/oauth/authorize?client_id=a3144def15f37b5cdf23'

  authWindow.loadURL(authUrl);
  
  // 监听 url 变化
  authWindow.webContents.on('will-navigate', function (event, newUrl) {
    console.log(newUrl);

    // 进入页面 http://localhost:3000/app?token=xxxxxxxxxxxxxx
    if (newUrl.includes('token')) {
      const token = new URL(newUrl).searchParams.get('token')

      console.log(token)

      // Open the DevTools.
      // mainWindow.webContents.openDevTools()

      // 将 token 回传到 index.html
      mainWindow.webContents.send('send-token', token)

      // 关闭 authWindow
      authWindow.close()
    }
  })
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let authWindow, mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function createAuthWindow() {
  authWindow = new BrowserWindow({
    width: 400,
    height: 600
  })
  
  authWindow.loadFile('auth.html')

  authWindow.on('closed', function () {
    authWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
