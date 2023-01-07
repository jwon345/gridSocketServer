const mongoose = require("mongoose");
const cors = require("cors")
const {Server} = require("socket.io");
const httpServer = require("http").createServer();

var corsOptions = {
    Credentials: true
  }
const io = new Server(httpServer,{cors:corsOptions});

const Schema = mongoose.Schema;

const url = "mongodb+srv://juu2410:123@initialtesting.kzns4pw.mongodb.net/MatrixDataBase?retryWrites=true&w=majority"; 

const UserModel = mongoose.model("matrix", new Schema({_id:{type:String},Data:{type:String}}), "matrix");

mongoose.connect(url)
  .then((results) => console.log("connected to DataBase"))
  .catch((err) => console.log("failed to connect to database -> " + err));
  
UserModel.watch()
  .on('change', (data) => updateDataHandler())

function updateDataHandler()
{
    UserModel.find()
        .then((results) => {
            io.emit("update", results);
            console.log(results);
        });
}

io.on('connection', (socket) => {
    console.log("socket connected");
    socket.on('disconnection' ,() => console.log("disconnected"));
    socket.on('message', (data) => console.log(data));
});

httpServer.listen(4000, () => {
    console.log("listening on port 4000");
});

// setInterval(() => {io.emit("update", "123")}, 5000);
