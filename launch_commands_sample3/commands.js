

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
          if (error){reject(error); console.warn(error)};
          resolve(stdout ? stdout : stderr);
       });
    });
 }

var config_machine= (user,host, password) =>{
   return {
      user: user,
      host: host,
      password: password
   }
}
 /** 
  * ?  [2] LAUNCH COMMAND VIA SSH **/
 
 /**var server_linux =  {
    user: 'hub4manuval-server',
    host: '158.42.163.97',
    password: '1gn1t10n'
 };**/
 const rexec_ssh = require('ssh-exec');
 /**{
    user: 'summit',
    host: '192.168.1.137',
    password: 'R0b0tn1K'
 }**/
 function execShellCommandSSH(cmd, config = {}) {
    //console.log("exec")
    return new Promise((resolve, reject) => {
       rexec_ssh(cmd, config, (error, stdout, stderr) => {
          if (error){reject(error)};
          console.log(stderr)
          console.log(stdout)
          resolve(stdout ? stdout : stderr);
       });
    });
 }
 async function sshSequence(commands=[],config = {}) {
    var result = ''; // commands:{name: "lsb_release -a", order: "1"}
    var commands_line='';
    for (let com of commands) {     
       commands_line = commands_line+com.name+";echo :: ;";
    }
    
    try{
      result = await execShellCommandSSH(commands_line,config);
    }catch(error){
       let {message} = error;
       return {message:message, succes:false};
       return error; //Error is a Object
     };
    console.log("[sshSequence result]::",result)
    return {message:result, succes:true}; //Creting a object about result
 }
 
 async function localSequence(commands=[]) {
    
    let commands_line='';
    for (let com of commands) {     
       commands_line = commands_line+com+";echo :: ;";
    }
    
    console.log(commands_line);
    try{
      result = await execShellCommand(commands_line);
    }catch(error) {
      console.warn("error",error.message)
       let {message} = error;
       return {message: message, succes: false}
     };
    console.log("[localSequence result]::",result)
    return {message: result, succes: true};
 }
 
 async function localCommand(command) {
    console.log("command",command)
   try{
     result = await execShellCommand(command);
   }catch(error) {
     console.warn("error",error.message)
      let {message} = error;
      return {message: message, succes: false}
    };
   console.log("[localCommand result]",{result})
   return {message: result, succes: true};
}
 
 
   exports.sshSequence = sshSequence;
   exports.localSequence = localSequence;
   exports.localCommand = localCommand;
 
