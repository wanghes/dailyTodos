var createDMG = require('electron-installer-dmg');
var path = require("path");

createDMG({
    appPath: path.join('./mac/todos-darwin-x64/todos.app'),
    name:'todos',
    icon:path.join('./images/logo.icns'),
    overwrite:true,
    out: path.join('./mac_release'),
}, function done (err) {
    console.log(err);
})
