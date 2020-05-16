// lib/app.ts
import { Employee } from "./objects/employe";
import { IProductionOperatos } from "./interface/interface-objects";


import express = require('express');

// Create a new express application instance
const app: express.Application = express();

app.get('/', function (req, res) {
    let per:IProductionOperatos = new Employee(100, "Bill");
  res.send(per.display());
});

var server=app.listen(3000,'0.0.0.0', function (err) {
    if(err){
        console.error('Error starting  server', err);
        return;
      }
      let port;
      let address;
      if(server!=null){
         port = server.address().port;
         address = server.address().address;
      }
      
      console.log("[HOST URL]",`http://${address}:${port}/`);
});