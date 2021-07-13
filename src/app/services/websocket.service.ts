import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root",
})
export class WebsocketService {
  constructor(private socket: Socket) {}
  connect() {
    return this.socket.on("connect", () => {
      console.log("connect");
    });
  }
  reciveEvent(eventName: string) {
    return this.socket.fromEvent(eventName);
  }
  disconnect() {
    return this.socket.on("disconnect", () => {
      console.log("disconnect");
    });
  }
}
