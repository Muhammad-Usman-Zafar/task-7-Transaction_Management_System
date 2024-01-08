const express = require("express");
require("dotenv").config()
const database = require("./DB/DBconnection")
const errorHandler = require("./handler/errorhandler")
const Route = require("./Routes/Registion")
const userdetail = require("./Routes/Transaction")

database();
const app = express();

const Port = process.env.PORT || 5000;

app.use(express.json())


app.use(Route);
app.use(userdetail);

app.use(errorHandler);


app.listen(Port, ()=>{
    console.log(`Running on Port ${Port}`);
});