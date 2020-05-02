const Client = require('./client'); 
const promisifyClient = new Client(); 
console.log(process.env.CLIENT_NAME)
promisifyClient.sendMessage('Hi').then((data) => {
    console.log(`Received: ${data}`);
    return promisifyClient.sendMessage('How are you');
}).then((data) => {
    console.log(`Received: ${data}`);
    return promisifyClient.sendMessage('Bye');
}).then((data) => {
    console.log(`Received: ${data}`);
    return promisifyClient.sendMessage('exit');
}).catch((err) => console.error(err));  
//npm run start:client
/* ------------------------- INTERVAL DETECT SERVER ------------------------- */