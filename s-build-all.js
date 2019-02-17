var NwBuilder = require('nw-builder');
const compressing = require('compressing');
var arugments = process.argv.slice(2);

var nw = new NwBuilder({
    files: './nwapp/**/**',
    platforms: ['osx64', 'win32', 'win64'],
    version: 'latest',
	flavor: ((typeof(arugments[0])!="undefined"&&!!arugments[0]&&arugments[0].trim()!==""&&arugments[0] == "--production")?"normal":"sdk"),
	macIcns: "./nwapp/favicon.icns",
	downloadUrl: ((typeof(arugments[1])!="undefined"&&!!arugments[1]&&arugments[1].trim()!==""&&arugments[1] == "--im-chinese")?"https://cdn.npm.taobao.org/dist/nwjs/":null),
	// winIco: "./nwapp/favicon.ico"
	winIco: ((typeof(arugments[2])!="undefined"&&!!arugments[2]&&arugments[2].trim()!==""&&arugments[2] == "--modify-win-icon") ?"./nwapp/favicon.ico":null)
});

nw.on('log',  console.log);

nw.build().then(function () {
	compressing.zip.compressDir('./build/yvdcover/win32/',
						    './build/yvdcover/yvdcover-win32.zip')
							.then(() => {
								console.log("win32 zipping SUCCESS");
							})
							.catch(err => {
								console.log("win32 zipping FAIL");
							});
	compressing.zip.compressDir('./build/yvdcover/win64/',
						    './build/yvdcover/yvdcover-win64.zip')
							.then(() => {
								console.log("win64 zipping SUCCESS");
							})
							.catch(err => {
								console.log("win64 zipping FAIL");
							});
	compressing.zip.compressDir('./build/yvdcover/osx64/',
						    './build/yvdcover/yvdcover-osx64.zip')
							.then(() => {
								console.log("osx64 zipping SUCCESS");
								console.log('all done!');
							})
							.catch(err => {
								console.log("osx64 zipping FAIL");
							});
}).catch(function (error) {
    console.error(error);
});