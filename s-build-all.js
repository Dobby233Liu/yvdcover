var NwBuilder = require('nw-builder');
const compressing = require('compressing');
var arugments = process.argv.slice(2);

var nw = new NwBuilder({
    files: './**/**',
    platforms: ['osx64', 'win32', 'win64'],
    version: 'latest',
	flavor: ((arugments[0].trim()!==""&&arugments[0] == "--production")?"normal":"sdk"),
	macIcns: "./favicon.icns",
	downloadUrl: ((arugments[1].trim()!==""&&arugments[1] == "--im-chinese")?"https://cdn.npm.taobao.org/dist/nwjs/":NwBuilder.defaults.downloadUrl)
	//winIco: "./favicon.ico"
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
							})
							.catch(err => {
								console.log("osx64 zipping FAIL");
							});
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});