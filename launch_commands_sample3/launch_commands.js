const exec = require('commands');

async function mycommand(com) {
let result
if(com) result = await exec.localCommand(com);
else return null
}
