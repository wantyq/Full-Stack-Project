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

// app.patch("/questions/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const question = await Post.findById(postId);

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }
//     question.comments.push(req.body);
//     const updatedQuestion = await question.save();

//     res.status(200).json(updatedQuestion);
//   } catch (err) {
//     console.log(`error: ${err}`);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put("/questions/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const updatedQuestion = req.body;
//     const result = await Post.findByIdAndUpdate(postId, updatedQuestion, {
//       new: true,
//     });
//     res.status(200).json({ message: "Question updated successfully", result });
//   } catch (err) {
//     console.log(`error: ${err}`);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.patch("/questions/:postId/comments/:commentId", async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     const question = await Post.findById(postId);

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     const commentIndex = question.comments.findIndex(
//       (comment) => comment.commentId === commentId
//     );

//     if (commentIndex === -1) {
//       return res.status(404).json({ error: "Comment not found" });
//     }

//     question.comments[commentIndex] = {
//       ...question.comments[commentIndex],
//       ...req.body,
//     };

//     const updatedQuestion = await question.save();

//     res.status(200).json(updatedQuestion);
//   } catch (err) {
//     console.log(`error: ${err}`);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.delete("/questions/:postId/comments/:commentId", async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     const question = await Post.findById(postId);

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     const commentIndex = question.comments.findIndex(
//       (comment) => comment.commentId === commentId
//     );

//     if (commentIndex === -1) {
//       return res.status(404).json({ error: "Comment not found" });
//     }

//     question.comments.splice(commentIndex, 1);

//     const updatedQuestion = await question.save();

//     res.status(200).json(updatedQuestion);
//   } catch (err) {
//     console.log(`error: ${err}`);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.patch("/questions/:postId/comments/:commentId/like", async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     const { userId, firstName, lastName } = req.body;
//     const question = await Post.findById(postId);

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     const commentIndex = question.comments.findIndex((comment) => {
//       return comment.commentId === commentId;
//     });

//     if (commentIndex === -1) {
//       return res.status(404).json({ error: "Comment not found" });
//     }

//     const comment = question.comments[commentIndex];
//     const likeIndex = comment.like.findIndex((like) => like.userId === userId);

//     const updatedComment = {
//       ...comment,
//       like: comment.like.filter((like) => like.userId !== userId),
//     };

//     if (likeIndex === -1) {
//       updatedComment.like.push({
//         userId,
//         firstName,
//         lastName,
//       });
//     }

//     question.comments[commentIndex] = updatedComment;

//     const updatedQuestion = await question.save();

//     res.status(200).json(updatedQuestion);
//   } catch (err) {
//     console.log(`error: ${err}`);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.patch(
//   "/questions/:postId/comments/:commentId/dislike",
//   async (req, res) => {
//     try {
//       const { postId, commentId } = req.params;
//       const { userId, firstName, lastName } = req.body;
//       const question = await Post.findById(postId);

//       if (!question) {
//         return res.status(404).json({ error: "Question not found" });
//       }

//       const commentIndex = question.comments.findIndex((comment) => {
//         return comment.commentId === commentId;
//       });

//       if (commentIndex === -1) {
//         return res.status(404).json({ error: "Comment not found" });
//       }

//       const comment = question.comments[commentIndex];
//       const dislikeIndex = comment.dislike.findIndex(
//         (dislike) => dislike.userId === userId
//       );

//       const updatedComment = {
//         ...comment,
//         dislike: comment.dislike.filter((dislike) => dislike.userId !== userId),
//       };

//       if (dislikeIndex === -1) {
//         updatedComment.dislike.push({
//           userId,
//           firstName,
//           lastName,
//         });
//       }

//       question.comments[commentIndex] = updatedComment;

//       const updatedQuestion = await question.save();

//       res.status(200).json(updatedQuestion);
//     } catch (err) {
//       console.log(`error: ${err}`);
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// app.delete("/questions/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const question = await Post.findById(postId);

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     await Post.findByIdAndDelete(postId);

//     const comments = question.comments.map((comment) => comment.commentId);

//     res
//       .status(200)
//       .json({ message: "Question and comments deleted successfully" });
//   } catch (err) {
//     console.log(`error: ${err}`);
//     res.status(500).json({ error: err.message });
//   }
// });
