import http from "http";
import socketIO from "socket.io";
import { PORT } from "./config/db";
import {
  SignUpEvent,
  LoginEvent,
  UpdateUserEvent,
  ViewUserEvent,
  DeleteUserEvent,
} from "./controller/UserEventController";
import {
  AddMoniterEvent,
  UpdateMoniterEvent,
  ViewMoniterEvent,
  DeleteMoniterEvent,
} from "./controller/MoniterEventController";
import {
  AddCpuEvent,
  UpdateCpuEvent,
  ViewCpuEvent,
  DeleteCpuEvent,
} from "./controller/CpuEventController";
import {
  AddMouseEvent,
  UpdateMouseEvent,
  ViewMouseEvent,
  DeleteMouseEvent,
} from "./controller/MouseEventController";
import {
  AddAssignEvent,
  UpdateAssignEvent,
  ViewAssignEvent,
  DeleteAssignEvent,
} from "./controller/AssignEventController";

class App {
  private server: http.Server;
  private io: socketIO.Server;

  constructor() {
    this.server = new http.Server();
    this.io = new socketIO.Server(this.server);
    //this.registration();
    this.loadSocketConnection();
    this.socketauth();
    //this.LoginEvent();
  }
  public socketauth() {
    this.io.use(async (socket, next) => {
      // const token = await event.tokenValidate(logindata.token);
      socket.handshake.headers.auth = [];
      const token = socket.handshake.headers;
      //console.log(token);
      if (token) {
        // const user = await event.tokenValidate(token)
        // console.log('Middleware Log : ',user)
        next();
      } else {
        next();
      }
    });
  }

  public Start() {
    this.server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}.`);
    });
  }

  //Socket Events
  public loadSocketConnection() {
    this.io.on("connection", (socket) => {
      socket.on("request", async (data) => {
        try {
          if (!data.event)
            socket.emit("response", { error: "Event name not found" });
          let result, token;
          if (socket?.handshake?.headers?.token)
            token = socket.handshake.headers.token;
          switch (data.event) {
            /*====================== Signup CRUD ======================*/
            case "signup":
              result = await SignUpEvent(data.data);
              //console.log(result);
              socket.emit("signup", result);
              break;

            case "login":
              result = await LoginEvent(data.data);
              socket.handshake.headers.token = result.token;
              console.log(result);
              break;

            case "updateuser":
              result = await UpdateUserEvent(data.data, token);
              console.log(
                "Update User Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "viewuser":
              result = await ViewUserEvent(data.data, token);
              console.log(
                "View User Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "deleteuser":
              result = await DeleteUserEvent(data.data, token);
              console.log(
                "Delete User Token Status:----",
                socket.handshake.headers.token
              );
              break;

            /*================= Mointer CRUD =================*/
            case "addmoniter":
              result = await AddMoniterEvent(data.data, token);
              console.log(
                "Add Moniter Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "updatemoniter":
              result = await UpdateMoniterEvent(data.data, token);
              console.log(
                "Update Moniter Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "viewmoniter":
              result = await ViewMoniterEvent(data.data, token);
              console.log(
                "View Moniter Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "deletemoniter":
              result = await DeleteMoniterEvent(data.data, token);
              console.log(
                "Delete Moniter Token Status:----",
                socket.handshake.headers.token
              );
              break;
            /*================= CPU CRUD =================*/
            case "addcpu":
              result = await AddCpuEvent(data.data, token);
              console.log(
                "Add Cpu Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "updatecpu":
              result = await UpdateCpuEvent(data.data, token);
              console.log(
                "Update Cpu Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "viewcpus":
              result = await ViewCpuEvent(data.data, token);
              console.log(
                "View Cpu Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "deletecpu":
              result = await DeleteCpuEvent(data.data, token);
              console.log(
                "Delete Cpu Token Status:----",
                socket.handshake.headers.token
              );
              break;

            /*================= Mouse CRUD =================*/
            case "addmouse":
              result = await AddMouseEvent(data.data, token);
              console.log(
                "Add Mouse Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "updatemouse":
              result = await UpdateMouseEvent(data.data, token);
              console.log(
                "Update Mouse Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "viewemouse":
              result = await ViewMouseEvent(data.data, token);
              console.log(
                "View Mouse Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "deletemouse":
              result = await DeleteMouseEvent(data.data, token);
              console.log(
                "Delete Mouse Token Status:----",
                socket.handshake.headers.token
              );
              break;

            /*================= Assign CRUD =================*/
            case "addassignsys":
              result = await AddAssignEvent(data.data, token);
              console.log(
                "Add Assign System Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "updateassignsys":
              result = await UpdateAssignEvent(data.data, token);
              console.log(
                "Update Assign System Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "vieweassignsys":
              result = await ViewAssignEvent(data.data, token);
              console.log(
                "View Assign System Token Status:----",
                socket.handshake.headers.token
              );
              break;

            case "deleteassignsys":
              result = await DeleteAssignEvent(data.data, token);
              console.log(
                "View Assign System Token Status:----",
                socket.handshake.headers.token
              );
              break;

            default:
              break;
          }
          socket.emit("response", { result });
        } catch (err) {
          socket.emit("response", { err: err });
        }
      });
    });
  }

  /*   public registration() {
    this.io.on("connection", (socket) => {
      //User Signup
      socket.on("signup", async (data) => {
        const signupdata = await UserEvent.signupEvent(data);
        console.log(signupdata);
        socket.emit("signup", signupdata);
      });
      console.log("New user is Connectedsssssss : " + socket.id);
    });
  }
 */
  /* public LoginEvent() {
    this.io.on("connection", (socket) => {
      //User Signup
      socket.on("login", async (data) => {
        const logindata = await UserEvent.LoginEvent(data);
        socket.handshake.headers.token = logindata.token;
        console.log(logindata);
        socket.emit("login", logindata);
      });
    });
  } */
}

new App().Start();
