require("dotenv/config.js");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const PORT = 3000;

app.use(require("morgan")("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardRouter);
connect();

async function connect() {
  try {
    await mongoose
      .connect(
        "mongodb+srv://noamab22:p2kspCA3Io0669uY@cluster0.m2gxd.mongodb.net/myFirstAPI"
      )
      .then(() => {
        console.log("connected to the database");
        app.listen(PORT, () => {
          console.log(`listening on port ${PORT}`);
        });
      });
  } catch (e) {
    console.log("failed to connect to the database", e.messsage);
  }
}
