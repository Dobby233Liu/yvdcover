var NwBuilder = require('nw-builder');
const compressing = require('compressing');
var arugments = process.argv.slice(2);

var nw = new NwBuilder({
    files: './**/**',
    platforms: ['osx64', 'win32', 'win64'],
    version: 'latest',
	flavor: ((arugments[0].trim()!==""&&arugments[0] == "--production")?"normal":"sdk"),
	macIcns: "./favicon.icns",
	//winIco: "./favicon.ico"
});

nw.on('log',  console.log);

nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});

compressing.zip.compressFile('./build/yvdcover/win32/',
						    './build/yvdcover/yvdcover-win32.zip')
							.then(() => {})
							.catch(err => {});
compressing.zip.compressFile('./build/yvdcover/win64/',
						    './build/yvdcover/yvdcover-win64.zip')
							.then(() => {})
							.catch(err => {});
compressing.zip.compressFile('./build/yvdcover/osx64/',
						    './build/yvdcover/yvdcover-osx64.zip')
							.then(() => {})
							.catch(err => {});
