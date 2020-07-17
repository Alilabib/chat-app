// import { WebSocket } from "../../../../../Library/Caches/deno/deps/https/deno.land/b6176dc18e9907eb0698fe98c937c935f0ede51c5251001d75ee1c02b4f277d7.ts";
import {WebSocket, isWebSocketCloseEvent} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

let sockets = new Map<string, WebSocket>(); 

interface BroadcastObj{
    name:string,
    msg:string
}

//broadcast events to all clients 
const broadcastEvent= (obj : BroadcastObj)=>{
    sockets.forEach((ws:WebSocket)=>{
       ws.send(JSON.stringify(obj)); 
    })
}

const chatConnection = async(ws:WebSocket)=>{   
    //Add New ws connection to map
    const uuid = v4.generate();
    sockets.set(uuid, ws);

    for await( const ev of ws){
        console.log(ev);
        // delete socket if connection closed 
        if(isWebSocketCloseEvent(ev)){
            sockets.delete(uuid);
        }

        //Create event object if event is string
        if(typeof ev ==='string'){
            let eventObject = JSON.parse(ev);
            broadcastEvent(eventObject);
            
        }
    }
}

export {chatConnection};