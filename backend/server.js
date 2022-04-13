const express = require("express");
const app = express();
const cors = require("cors");

const db = require("./models");

app.use(express.json());
app.use(cors());

//Routers
const postRouter = require("./routes/posts.routes");
app.use("/posts", postRouter);
const commentRouter = require("./routes/comments.routes");
app.use("/comments", commentRouter);
const userRouter = require("./routes/users.routes");
app.use("/auth", userRouter);
const likeRouter = require("./routes/likes.routes");
app.use("/likes", likeRouter);

db.sequelize.sync().then(() => {
  app.listen(4200, () => {
    console.log("listening on port 4200");
  });
});
