require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userCtrl = require('./ctrl');
const session = require("express-session");

const {createUser, loginUser, getSession} = userCtrl;
const app = express()
const {PORT, SESSION_SECRET } = process.env
const port = process.env.PORT || 4800;


app.use(express.json());
app.use(cors());
app.use(session({
        secret: SESSION_SECRET || "default",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true},
}))



app.post("/api/user", createUser)
app.post("/api/login", loginUser)
app.get("/api/session", getSession)

app.listen(port, ()=> console.log(`Running on port ${port}.`));