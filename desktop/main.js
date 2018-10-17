const electron = require('electron')
// Module to control application life.
const app = electron.app
const globalShortcut = electron.globalShortcut
const Menu = electron.Menu
// Module to create native browser window.
// const BrowserWindow = electron.remote.BrowserWindow
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const path = require('path')
const url = require('url')

let mainWindow


let template = [{
        label: '编辑',
        submenu: [{
            label: '撤销',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        }, {
            label: '重做',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            label: '剪切',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        }, {
            label: '复制',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        }, {
            label: '粘贴',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        }, {
            label: '全选',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }]
    }, {
        label: '查看',
        submenu: [{
            label: '重载',
            accelerator: 'CmdOrCtrl+R',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    // 重载之后, 刷新并关闭所有的次要窗体
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function (win) {
                            if (win.id > 1) {
                                win.close()
                            }
                        });
                    }
                    focusedWindow.reload()
                }
            }
        }, {
            label: '切换全屏',
            accelerator: (function () {
                if (process.platform === 'darwin') {
                    return 'Ctrl+Command+F'
                } else {
                    return 'F11'
                }
            })(),
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                }
            }
        }, {
            label: '切换开发者工具',
            accelerator: (function () {
                if (process.platform === 'darwin') {
                    return 'Alt+Command+I'
                } else {
                    return 'Ctrl+Shift+I'
                }
            })(),
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        }, {
            type: 'separator'
        }, {
            label: '应用程序菜单演示',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    const options = {
                        type: 'info',
                        title: '应用程序菜单演示',
                        buttons: ['好的'],
                        message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
                    }
                    electron.dialog.showMessageBox(focusedWindow, options, function () {})
                }
            }
        }]
    }, {
        label: '窗口',
        role: 'window',
        submenu: [{
            label: '最小化',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: '关闭',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }, {
            type: 'separator'
        }, {
            label: '重新打开窗口',
            accelerator: 'CmdOrCtrl+Shift+T',
            enabled: false,
            key: 'reopenMenuItem',
            click: function () {
                app.emit('activate')
            }
        }]
    }, {
        label: '帮助',
        role: 'help',
        submenu: [{
            label: 'github',
            click: function() {
                electron.shell.openExternal('https://github.com/wanghes')
            }
        }]
    }
];


function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        title:"天天日记",
        defaultFontFamily:"Microsoft Yahei" ,
        webPreferences: {webSecurity: false}
    });
    // mainWindow.maximize();
    // mainWindow.setFullScreen(true);
    // globalShortcut.register('ESC', () => {
    //     mainWindow.setFullScreen(false);
    // });
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);

    mainWindow.loadURL(`http://tf.mousecloud.cn`);
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, 'dist/index.html'),
    //     protocol: 'file://',
    //     slashes: true
    // }))


    // dialog.showMessageBox({
    //     type: 'info',
    //     message: 'Success!',
    //     detail: 'You pressed the registered global shortcut keybinding.',
    //     buttons: ['OK']
    // })

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
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
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
