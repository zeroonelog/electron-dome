const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const electron = require('electron')

/*获取electron窗体的菜单栏*/
const Menu = electron.Menu
const dialog = electron.dialog
let mainWindow


function disableShotcut(shutcut) {
  let ret = globalShortcut.register(shutcut, () => {
    console.log(`${shutcut} is pressed`)
  })
  if (!ret) {
    console.log('registration failed')
  }
  // 检查快捷键是否注册成功
  console.log(shutcut + ":" + globalShortcut.isRegistered(shutcut))
}

function createWindow() {

  disableShotcut("Esc") // 最小化
  disableShotcut("F11") // 最小化
  // disableShotcut("Tab") // 最小化

  // 创建浏览器窗口。
  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    fullscreen: true,
    backgroundColor: "ffffff",
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    show: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  // 然后加载应用的 index.html。
  mainWindow.loadFile('index.html')

  // 打开开发者工具
  mainWindow.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  //阻止窗口关闭
  let canQuit = false;
  mainWindow.on('close', e => {
    console.log('user request close');
    if (!canQuit) e.preventDefault()//阻止关闭
  })

  globalShortcut.register('ESC', () => {
    console.log(123);
    mainWindow.setFullScreen(true);
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on("onCloseWin", async (event, value) => {
  app.exit()
});
ipcMain.on("showModel", async (event, value) => {
  dialog.showErrorBox('警告','账号或密码错误')
  event.sender.send('downloadCall', null);
});
