var colors = require('colors'); // Get color and style in your node.js console
/**
 *  ? Launching python file in Nodejs
 */

function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
       exec(cmd, (error, stdout, stderr) => {
          if (error) console.warn(error);
          resolve(stdout ? stdout : stderr); 
       });
    });
 }
 
 async function commandSequence() {

    const environ = await execShellCommand('python --version');
    console.log("[Local Environment]".green, environ);
   
    const cc = await execShellCommand('/usr/bin/python3 --version');
    console.log("[python3]".blue,cc);
    let ter="/usr/bin/python3 /home/manu/Documents/worksapce/test/launch.py -c 'ls' -t JSON"
    const py = await execShellCommand(ter);
    console.log("[Output's python file ]".brightYellow,py);
 }
 
 commandSequence();