const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { register, login } = require("./controllers/auth");
const { 
  createQuestion, 
  getQuestions, 
  editQuestion,
  putQuestion, 
  deleteQuestion,
  editComment,
  deleteComment,
  likeComment,
  dislikeComment, 
} = require("./controllers/questions");

const { verifyToken } = require("./middleware/auth");

const User = require("./models/User");
const Post = require("./models/Posts");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
const uri = process.env.URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Server Port is: ${port}`));
  })
  .catch((error) => console.log(error));

app.use(cors());
app.use(express.json());

app.post("/register", register);
app.post("/login", login);

app.post("/questions", createQuestion);
app.get("/questions", getQuestions);
app.patch("/questions/:postId", editQuestion);
app.put("/questions/:postId", putQuestion);
app.delete("/questions/:postId", deleteQuestion);
app.patch("/questions/:postId/comments/:commentId", editComment);
app.delete("/questions/:postId/comments/:commentId", deleteComment);
app.patch("/questions/:postId/comments/:commentId/like", likeComment);
app.patch("/questions/:postId/comments/:commentId/dislike", dislikeComment);
