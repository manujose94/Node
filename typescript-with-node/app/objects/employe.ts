import {v4 as uuidv4 } from 'uuid';
var dateFormat = require('dateformat');

import { IProductionOperatos } from "../interface/interface-objects";
import { Person } from "./person";
export class Employee extends Person  implements IProductionOperatos {
    empCode: number;
    uuid: string;
    date: Date;

    constructor(empcode: number, name:string) {
        super(name);
        this.empCode = empcode;
        this.uuid=uuidv4();
        this.date=dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss ");
    }
 
    display(): string{
        console.log("Name = " + this.name +  ", Employee Code = " + this.empCode+" date of admission: "+this.date);
        return "Name = " + this.name +  ", Employee Code = " + this.empCode+" date of admission: "+this.date
    }
    
    displayName():void {
        console.log("Name = " + this.name +  ", Employee Code = " + this.empCode);
    }
}