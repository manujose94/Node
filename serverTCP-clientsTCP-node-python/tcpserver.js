var colors = require('colors');
const fp = require("find-free-port"); //Obtain a free port
var net = require('net'); //Sockets
var events = require('events');
var eventEmitter = new events.EventEmitter();
//https://www.knowledgehut.com/tutorials/node-js/socket-services
//https://millermedeiros.github.io/mdoc/examples/node_api/doc/net.html
let freePort;
let server;
let socketsClient = []; 
let serverAddress;
/* -------------------------------------------------------------------------- */
/*                              Example Test TCP
/*                            1. Create server
/*                            2. Wait for a some client to respond
/*                            3. Reply to Client
/*                            4. Wait second time until its response
/* -------------------------------------------------------------------------- */

async function InitServer() {
 
    freePort =  await fp(3000,3100);
    process.env.PORT = [0]
    let serverAddress = await createServer(freePort[0],"localhost")
    console.log('Server listening on %j', serverAddress)

    try{

        let result = await waitEventClientData(eventEmitter,32000)
        console.log("[RESULT]".blue,result);

        if(result.hasOwnProperty('idsocket')){
            result_w = await writeClient(socketsClient.find(o => o.id === result.idsocket).socket);
            result = await waitEventClientData(eventEmitter,12000)
            console.log("[RESULT]".blue,result);
        }else console.log("[FINISH]");

    }catch(error) {
        if(error.message.hasOwnProperty("type")) console.warn("[TIMEOUT]".red,error.message.type)
        else console.warn("error",error.message)
    }

    
 }

/* -------------------------- CREATE ONE SERVER TCP ------------------------- */

 function createServer(port,host){
    return new Promise((resolve, reject) => {

        server = net.createServer(handleConnection);
        server.on('error', function(err) {
            let msg = "Connection error: " + err + " for " + server.address();
            console.log(msg);
            reject(msg)
        });
        server.listen(port,host, () => {
          port = server.address().port;
          //{"address":"127.0.0.1","family":"IPv4","port":3000}
          resolve(server.address());
        });
    });
     

 }

/* ----------- CALLBACK DEINFED WHAN CLIENT CONNECTS (FIRTS TIME) ----------- */

 async function handleConnection(socket){
    let id = socket.remoteAddress + ':' + socket.remotePort;
    console.log("[New Client connection]".green,id);            

    socketsClient.push({socket: socket, id: id}); 
    socket.on('data', function (data) {
        let msg={};
        if(typeof data ==='object' ){
            try{
                msg = JSON.parse(data);
            }catch( e){
                if (e instanceof SyntaxError){
                    msg["message"]=data.toString();
                    msg["succes"]=true;
                }else console.error(e);

            }
            console.log("[CLIENTE MSG]".blue,msg)
            //Find client stiored on Array
            let picked = socketsClient.find(o => o.id === socket.remoteAddress + ':' + socket.remotePort);
            //Add id client socket host:port
            msg["idsocket"]=picked.id;
            //If we want to add timeout for each client it's necessary to add 'setTimeout'  as a variable on Array
            //msg["timer"]=setTimeout()

           /**if(msg.hasOwnProperty('uuid'))
            console.log("[CLIENT UUID]",msg.uuid,msg)**/
        }else msg=data;
  
        eventEmitter.emit('msg', msg);
    })
    socket.on('end', function() {
        console.log('[Client disconnected]'.red,id);
    });

 }

/* ---------------------- Wrie to a specific client TCP --------------------- */

 function writeClient(socket){
    return new Promise((resolve, reject) => {
        socket.write("New message from server", (error)=>{
            if(!error){ 
                console.log("[SERVER]".yellow,"MESSAGE SENT")
                resolve(true)
        }else{
            console.log("[SERVER]".yellow,"MESSAGE ERROR TO SENT")}
            reject(false)
        })

    });
    
 }

/* --------------- Promise and Tiemout for response of clients -------------- */

 function waitEventClientData(eventEmitter, t) {
    return new Promise((resolve, reject) => {
        
        eventEmitter.on('msg', (data) => {
          clearTimeout(timer);
          resolve(data);
       });

        timer = setTimeout(function() {
        reject(new Error({type:"Timout wait cliente reply"}));
    }, t);

    });
 }

/* ----------------------------- START TEST TCP ----------------------------- */

 InitServer()
//npm start
