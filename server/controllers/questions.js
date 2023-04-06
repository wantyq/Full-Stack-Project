const Post = require("../models/Posts");
const User = require("../models/User");

const getQuestions = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let post = null;

    if (!post) {
      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        description,
        likes: {},
        dislikes: {},
        comments: [],
      });
      post = await newPost.save();
    }
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId, userId, comment } = req.params;
    const question = await Post.findById(postId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      comment,
    };
    post.comments.push(newComment);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editQuestion = async (req, res) => {
    try {
      const { postId } = req.params;
      const question = await Post.findById(postId);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      question.comments.push(req.body);
      const updatedQuestion = await question.save();

      res.status(200).json(updatedQuestion);
    } catch (err) {
      console.log(`error: ${err}`);
      res.status(500).json({ error: err.message });
    }
};

const putQuestion = async (req, res) => {
    try {
    const { postId } = req.params;
    const updatedQuestion = req.body;
    const result = await Post.findByIdAndUpdate(postId, updatedQuestion, {
      new: true,
    });
    res.status(200).json({ message: "Question updated successfully", result });
  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).json({ error: err.message });
  }
}

const deleteQuestion = async (req, res) => {
    try {
      const { postId } = req.params;
      const question = await Post.findById(postId);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      await Post.findByIdAndDelete(postId);

      const comments = question.comments.map((comment) => comment.commentId);

      res
        .status(200)
        .json({ message: "Question and comments deleted successfully" });
    } catch (err) {
      console.log(`error: ${err}`);
      res.status(500).json({ error: err.message });
    }
}

const editComment = async (req, res) => {
    try {
    const { postId, commentId } = req.params;
    const question = await Post.findById(postId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const commentIndex = question.comments.findIndex(
      (comment) => comment.commentId === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    question.comments[commentIndex] = {
      ...question.comments[commentIndex],
      ...req.body,
    };

    const updatedQuestion = await question.save();

    res.status(200).json(updatedQuestion);
  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).json({ error: err.message });
  }
}

const deleteComment = async (req, res) => {
    try {
    const { postId, commentId } = req.params;
    const question = await Post.findById(postId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const commentIndex = question.comments.findIndex(
      (comment) => comment.commentId === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    question.comments.splice(commentIndex, 1);

    const updatedQuestion = await question.save();

    res.status(200).json(updatedQuestion);
  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).json({ error: err.message });
  }
}

const likeComment = async (req, res) => {
    try {
    const { postId, commentId } = req.params;
    const { userId, firstName, lastName } = req.body;
    const question = await Post.findById(postId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const commentIndex = question.comments.findIndex((comment) => {
      return comment.commentId === commentId;
    });

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = question.comments[commentIndex];
    const likeIndex = comment.like.findIndex((like) => like.userId === userId);

    const updatedComment = {
      ...comment,
      like: comment.like.filter((like) => like.userId !== userId),
    };

    if (likeIndex === -1) {
      updatedComment.like.push({
        userId,
        firstName,
        lastName,
      });
    }

    question.comments[commentIndex] = updatedComment;

    const updatedQuestion = await question.save();

    res.status(200).json(updatedQuestion);
  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).json({ error: err.message });
  }
}

const dislikeComment = async (req, res) => {
      try {
      const { postId, commentId } = req.params;
      const { userId, firstName, lastName } = req.body;
      const question = await Post.findById(postId);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const commentIndex = question.comments.findIndex((comment) => {
        return comment.commentId === commentId;
      });

      if (commentIndex === -1) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const comment = question.comments[commentIndex];
      const dislikeIndex = comment.dislike.findIndex(
        (dislike) => dislike.userId === userId
      );

      const updatedComment = {
        ...comment,
        dislike: comment.dislike.filter((dislike) => dislike.userId !== userId),
      };

      if (dislikeIndex === -1) {
        updatedComment.dislike.push({
          userId,
          firstName,
          lastName,
        });
      }

      question.comments[commentIndex] = updatedComment;

      const updatedQuestion = await question.save();

      res.status(200).json(updatedQuestion);
    } catch (err) {
      console.log(`error: ${err}`);
      res.status(500).json({ error: err.message });
    }
}

module.exports = { 
  createQuestion, 
  getQuestions, 
  editQuestion,
  putQuestion, 
  addComment, 
  deleteQuestion,
  editComment,
  deleteComment,
  likeComment,
  dislikeComment 
};
