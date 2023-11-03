require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userCtrl = require("./ctrl/userCtrl");
const session = require("express-session");

const { createUser, loginUser, getSession } = userCtrl;
const { PORT, SESSION_SECRET } = process.env;

const port = PORT || 4800;
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: SESSION_SECRET || "default",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.post("/api/user", createUser);
app.post("/api/login", loginUser);
app.get("/api/session", getSession);

app.listen(port, () => console.log(`Running on port ${port}`));
