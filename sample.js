

/** 
 * ? [1] LAUNCH COMMAND TO TERMINAL */ 

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
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
   const javaInfo = await execShellCommand('node --version');
   console.log(javaInfo);
   const javaInfo2 = await execShellCommand('python --version');
   console.log(javaInfo2);
}

/** Another option **/

/**var exec = require('ssh-exec')
var v_host = '158.42.163.97'
var con =exec('ls -lh', {
  user: 'hub4manuval-server',
  host: '158.42.163.97',  
  password: '1gn1t10n' 
})

con.pipe(process.stdout , function (err, data) {
    if ( err ) { console.log(v_host); console.log(err); }
  console.log(data)
})**/

/** 
 * ?  [2] LAUNCH COMMAND VIA SSH **/
const rexec_ssh = require('ssh-exec');

function execShellCommandSSH(cmd) {
   //console.log("exec")
   return new Promise((resolve, reject) => {
      rexec_ssh(cmd, {
         user: 'student',
         host: '192.168.225.130',
         password: 'student'
      }, (error, stdout, stderr) => {
         if (error) console.warn(error);
         resolve(stdout ? stdout : stderr);
      });
   });
}
async function sshSequence() {
   let first = await execShellCommandSSH('rostopic list');
   console.log({first});
   
}

/**
 * TODO: TRY uname ; nodejs --version ; python --version
 * ? uname ; echo '::' ;  nodejs --version ;echo '::' ; python --version 
 * * succesfull
 */

// LAUNCH EXAMPLES 

   //commandSequence();
   sshSequence();
// Example get IP from node
//rosnode info /turtle_pointer | grep -oE '[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}'
// Example get IP from Host Manchine
// ip route get 8.8.8.8 | grep -oE '[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}' | tail -1

