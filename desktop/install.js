var electronInstaller = require('electron-winstaller');
var path = require("path")

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory:  path.join('./win/todos-win32-x64'),
    outputDirectory: path.join('./win_release/build/installer64'),
    authors: 'wang_hes',
    exe: 'todos.exe',
    noMsi: true
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
