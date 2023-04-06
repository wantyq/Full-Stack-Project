import * as Yup from "yup";

import { ErrorMessage, Form, Formik } from "formik";
import { FaLocationArrow, FaPen, FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import SortButton from "../../components/SortButton/SortButton";
import avatar from "../../assets/images/avatar.png";
import axios from "axios";
import { mintCream } from "../../assets/consts/colors";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [showOnlyComments, setShowOnlyComments] = useState(false);
    const [showNoComments, setShowNoComments] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);

    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);

    const validationSchema = Yup.object().shape({
        comments: Yup.string().required(""),
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/questions")
            .then((response) => {
                setQuestions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const sortByCommentLength = (asc) => {
        const sortedQuestions = [...questions];
        sortedQuestions.sort((a, b) => {
            if (asc) {
                return a.comments.length - b.comments.length;
            } else {
                return b.comments.length - a.comments.length;
            }
        });
        setQuestions(sortedQuestions);
    };

    const filteredQuestions = questions.filter((q) => {
        if (showOnlyComments) {
            return q.comments && q.comments.length > 0;
        } else if (showNoComments) {
            return !q.comments || q.comments.length === 0;
        }
        return true;
    });

    const handleShowOnlyComments = () => {
        setShowOnlyComments(!showOnlyComments);
        setShowNoComments(false);
    };

    const handleShowNoComments = () => {
        setShowNoComments(!showNoComments);
        setShowOnlyComments(false);
    };

    const handleShowAllQuestions = () => {
        setShowOnlyComments(false);
        setShowNoComments(false);
    };

    const handleSubmit = (postId, values, { setSubmitting, resetForm }) => {
        axios
            .patch(`http://localhost:3000/questions/${postId}`, {
                userId: user._id,
                commentId: uuidv4(),
                firstName: user.firstName,
                lastName: user.lastName,
                like: [],
                dislike: [],
                comments: values.comments,
            })
            .then((response) => {
                const updatedQuestions = [...questions];
                const index = updatedQuestions.findIndex((q) => q._id === postId);
                updatedQuestions[index] = response.data;
                setQuestions(updatedQuestions);
                toast.success("Comment added successfully!");
                values.comments = '';
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    toast.error("Error adding comment: " + error.response.data.error);
                } else if (error.request) {
                    toast.error(
                        "Error adding comment: No response received from the server."
                    );
                } else {
                    toast.error("Error adding comment: " + error.message);
                }
                console.log(error.config);
            })
            .finally(() => {
                setSubmitting(false);
                resetForm();
            });
    };

    const handleEdit = (questionId, values, { setSubmitting }) => {
        const currentDate = new Date().toISOString();
        axios
            .put(`http://localhost:3000/questions/${questionId}`, {
                description: values.description,
                lastUpdated: currentDate,
            })
            .then((response) => {
                const updatedQuestions = [...questions];
                const index = updatedQuestions.findIndex((q) => q._id === questionId);
                updatedQuestions[index] = response.data;
                setQuestions(updatedQuestions);
                toast.success("Question updated successfully!");
                setEditingQuestion(null);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error updating question.");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleCommentEdit = (questionId, commentId, values, { setSubmitting }) => {
        const currentDate = new Date().toISOString();
        axios
            .patch(`http://localhost:3000/questions/${questionId}/comments/${commentId}`, {
                comments: values.comments,
                lastUpdated: currentDate,
            })
            .then((response) => {
                const updatedQuestions = [...questions];
                const index = updatedQuestions.findIndex((q) => q._id === questionId);
                updatedQuestions[index] = response.data;
                if (response.data.comments) {
                    response.data.comments = response.data.comments.map((comment) => {
                        if (comment.commentId === commentId) {
                            return {
                                ...comment,
                                lastUpdated: currentDate
                            };
                        }
                        return comment;
                    });
                }
                setQuestions(updatedQuestions);
                toast.success("Comment updated successfully!");
                setEditingComment(null);
                response.data.comments.find((c) => c.commentId === commentId);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error updating comment.");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleCommentDelete = (questionId, commentId) => {
        axios
            .delete(`http://localhost:3000/questions/${questionId}/comments/${commentId}`)
            .then((response) => {
                const updatedQuestions = [...questions];
                const index = updatedQuestions.findIndex((q) => q._id === questionId);
                updatedQuestions[index] = response.data;
                setQuestions(updatedQuestions);
                toast.success("Comment deleted successfully!");
                response.data.comments.find((c) => c.commentId === commentId);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error deleting comment.");
            });
    };


    const handleLikeComment = (questionId, commentId) => {
        axios
            .patch(`http://localhost:3000/questions/${questionId}/comments/${commentId}/like`, {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
            })
            .then((response) => {
                const updatedQuestions = [...questions];
                const questionIndex = updatedQuestions.findIndex((q) => q._id === questionId);
                const commentIndex = updatedQuestions[questionIndex].comments.findIndex((c) => c.commentId === commentId);
                const updatedComment = response.data.comments.find((c) => c.commentId === commentId);
                updatedComment.likesAmount = updatedComment.like ? updatedComment.like.length : 0;
                console.log(updatedComment.likesAmount)
                updatedQuestions[questionIndex].comments[commentIndex] = updatedComment;
                setQuestions(updatedQuestions);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error liking comment.");
            });
    };

    const handleDislikeComment = (questionId, commentId) => {
        axios
            .patch(`http://localhost:3000/questions/${questionId}/comments/${commentId}/dislike`, {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
            })
            .then((response) => {
                const updatedQuestions = [...questions];
                const questionIndex = updatedQuestions.findIndex((q) => q._id === questionId);
                const commentIndex = updatedQuestions[questionIndex].comments.findIndex((c) => c.commentId === commentId);
                const updatedComment = response.data.comments.find((c) => c.commentId === commentId);
                updatedComment.dislikesAmount = updatedComment.dislike.length;
                updatedQuestions[questionIndex].comments[commentIndex] = updatedComment;
                setQuestions(updatedQuestions);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error liking comment.");
            });
    };

    const handleDelete = (questionId) => {
        axios.delete(`http://localhost:3000/questions/${questionId}`)
            .then(response => {
                const updatedQuestions = [...questions];
                const index = updatedQuestions.findIndex((q) => q._id === questionId);
                updatedQuestions[index] = response.data;
                setQuestions(updatedQuestions);
                toast.success("Question deleted successfully!");
            })
            .catch(error => {
                console.log(error);
                toast.error("Error deleting question.");
            });
    };

    return (
        <Wrapper>
            <SortWrapper>
                <SortButton onClick={handleShowOnlyComments}>
                    Posts with comments
                </SortButton>
                <SortButton onClick={handleShowNoComments}>
                    Posts without comments
                </SortButton>
                <SortButton onClick={handleShowAllQuestions}>Show All</SortButton>
                <SortButton onClick={() => sortByCommentLength(true)}>Sort by comment length (asc)</SortButton>
                <SortButton onClick={() => sortByCommentLength(false)}>Sort by comment length (desc)</SortButton>
            </SortWrapper>
            {Array.isArray(questions) && questions.length > 0 ?
                filteredQuestions.map((question) => (
                    <QuestionCard key={question._id}>
                        <NameWrapper>
                            <Avatar />
                            {question.firstName} {question.lastName}
                        </NameWrapper>
                        <>
                            <p>{question.description}</p>
                            {question.lastUpdated && question.lastUpdated.slice(0, -5) === question.createdAt.slice(0, -5) ? (
                                <p></p>
                            ) : (
                                <small>Question was updated: {new Date(question.lastUpdated).toLocaleString()}</small>
                            )}
                            <CommentButtonContainer>
                                <ActionButton>
                                    <FaPen onClick={() => setEditingQuestion(question._id)}>
                                        Edit question
                                    </FaPen>
                                </ActionButton>
                                <ActionButton>
                                    <FaTrash onClick={() => handleDelete(question._id)}>
                                        Delete question
                                    </FaTrash>
                                </ActionButton>
                            </CommentButtonContainer>
                            <CommentSection>
                                <Formik
                                    initialValues={{
                                        comments: "",
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, { setSubmitting }) =>
                                        handleSubmit(question._id, values, { setSubmitting })
                                    }
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <InputContainer>
                                                <FormikInput
                                                    name="comments"
                                                    placeholder="Enter your comment here"
                                                    required
                                                />
                                                <ErrorMessage name="comments" component="div" />
                                                <SendButton type="submit" disabled={isSubmitting}>
                                                    <FaLocationArrow />
                                                </SendButton>
                                            </InputContainer>
                                        </Form>
                                    )}
                                </Formik>
                            </CommentSection>
                            {question.comments.map((comment, index) => (
                                <div key={index}>
                                    {editingComment === comment.commentId && (
                                        <Formik
                                            initialValues={{ comments: comment.comments }}
                                            validationSchema={validationSchema}
                                            onSubmit={(values, { setSubmitting }) =>
                                                handleCommentEdit(question._id, comment.commentId, values, { setSubmitting })
                                            }
                                        >
                                            {({ isSubmitting }) => (
                                                <Form>
                                                    <FormikInput
                                                        name="comments"
                                                        placeholder="Enter your comment here"
                                                    />
                                                    <Button type="submit" disabled={isSubmitting}>
                                                        Update
                                                    </Button>
                                                </Form>
                                            )}
                                        </Formik>
                                    )}
                                </div>
                            ))}
                        </>
                        {editingQuestion === question._id ? (
                            <Formik
                                initialValues={{ description: question.description }}
                                onSubmit={(values, { setSubmitting }) =>
                                    handleEdit(question._id, values, { setSubmitting })
                                }
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <FormikInput
                                            name="description"
                                            type="description"
                                            placeholder="Enter your question here"
                                        />
                                        <Button type="submit" disabled={isSubmitting}>
                                            Update
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        ) : (
                            <div></div>
                        )}
                        <div>
                            {question.comments.length > 0 && (
                                <div>
                                    <CommentContainer>
                                        <CommentsFullBlock>
                                            <Avatar />
                                            <CommentsTextArea>
                                                <UserName>
                                                    {question.comments[0].firstName + " " + question.comments[0].lastName}
                                                </UserName>
                                                {question.comments[0].comments}
                                            </CommentsTextArea>
                                        </CommentsFullBlock>
                                        <CommentButtonContainer>
                                            <ActionButton>
                                                <FaThumbsUp onClick={() => handleLikeComment(question._id, question.comments[0].commentId)}>Like</FaThumbsUp>
                                                <span>{question.comments[0].like ? (question.comments[0].like.length || 0) : 0}</span>
                                            </ActionButton>
                                            <ActionButton>
                                                <FaThumbsDown onClick={() => handleDislikeComment(question._id, question.comments[0].commentId)}>Dislike</FaThumbsDown>
                                                <span>{question.comments[0].dislike ? (question.comments[0].dislike.length || 0) : 0}</span>
                                            </ActionButton>
                                            <ActionButton>
                                                <FaPen onClick={() => setEditingComment(question.comments[0].commentId)}>Edit comment</FaPen>
                                            </ActionButton>
                                            <ActionButton>
                                                <FaTrash onClick={() => handleCommentDelete(question._id, question.comments[0].commentId)}>Delete comment</FaTrash>
                                            </ActionButton>
                                        </CommentButtonContainer>
                                    </CommentContainer>
                                    {showAllComments &&
                                        question.comments.slice(1).map((comment, index) => (
                                            <div key={index}>
                                                {editingComment === comment.commentId ? (
                                                    <Formik
                                                        initialValues={{ comments: comment.comments }}
                                                        validationSchema={validationSchema}
                                                        onSubmit={(values, { setSubmitting }) =>
                                                            handleCommentEdit(question._id, comment.commentId, values, { setSubmitting })
                                                        }
                                                    >
                                                        {({ isSubmitting }) => (
                                                            <Form>
                                                                <FormikInput
                                                                    name="comments"
                                                                    type="comments"
                                                                    placeholder="Enter your comment here"
                                                                />
                                                                <ErrorMessage name="comments" component="div" />
                                                                <Button type="submit" disabled={isSubmitting}>
                                                                    Update
                                                                </Button>
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                ) : (
                                                    <CommentContainer>
                                                        <CommentsFullBlock>
                                                            <Avatar />
                                                            <CommentsTextArea>
                                                                <UserName>
                                                                    {question.comments[0].firstName + " " + question.comments[0].lastName}
                                                                </UserName>
                                                                {comment.comments}
                                                            </CommentsTextArea>
                                                        </CommentsFullBlock>
                                                        <CommentButtonContainer>
                                                            <ActionButton>
                                                                <FaThumbsUp onClick={() => handleLikeComment(question._id, comment.commentId)}>Like</FaThumbsUp>
                                                                <span>{comment.like ? (comment.like.length || 0) : 0}</span>
                                                            </ActionButton>
                                                            <ActionButton>
                                                                <FaThumbsDown onClick={() => handleDislikeComment(question._id, comment.commentId)}>Dislike</FaThumbsDown>
                                                                <span>{comment.dislike ? (comment.dislike.length || 0) : 0}</span>
                                                            </ActionButton>
                                                            <ActionButton>
                                                                <FaPen onClick={() => setEditingComment(comment.commentId)}>Edit comment</FaPen>
                                                            </ActionButton>
                                                            <ActionButton>
                                                                <FaTrash onClick={() => handleCommentDelete(question._id, comment.commentId)}>Delete comment</FaTrash>
                                                            </ActionButton>
                                                        </CommentButtonContainer>
                                                    </CommentContainer>
                                                )}
                                            </div>
                                        ))
                                    }
                                    {question.comments.length > 1 && (
                                        <CommentsDisplayBtn onClick={() => setShowAllComments(!showAllComments)}>
                                            {showAllComments ? 'Hide comments' : `View all ${question.comments.length} comments`}
                                        </CommentsDisplayBtn>
                                    )}
                                </div>
                            )}
                        </div>
                    </QuestionCard>
                ))
                : <div>No questions found</div>
            }
        </Wrapper>
    );

};

export default Questions;

const SortWrapper = styled.div`
  display: flex;  
  flex-direction: row;
  gap: 8px;
`;

const Wrapper = styled.div`
  display: flex;  
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const QuestionCard = styled.div`  
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: white;
  border-radius: 4px;
  padding: 16px;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
`;

const NameWrapper = styled.div`
  font-weight: 500; 
  font-size: 14px;
  color: #858383;
  display: flex; 
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  background-size: cover;
  border-radius: 100%;
  border: 3px solid rgb(255, 255, 255, 0.7);
  background-image: url(${avatar});
`;

const CommentSection = styled.div`
  border: none;  
`;

const CommentButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: center;
  align-items: center;
  padding: 8px; 
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: #e6e6e6;
  }
`;

const CommentContainer = styled.div`
    display: flex;
    background-color: transparent;
    flex-direction: column;
    padding-top: 8px;
    border-radius: 4px;
`;

const SendButton = styled.button`
  border: none;
  padding: 8px;
  background-color: ${mintCream};
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  right: 5px;  
  bottom: 8px;
`;

const InputContainer = styled.div`
    position: relative;
    padding: 0;
`;

const CommentsDisplayBtn = styled.button`
  color: grey;  
  font-size: 14px;
  margin-top: 16px;
  margin-bottom: 16px;
  font-weight: 600;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const CommentsFullBlock = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: flex-start;
`;

const CommentsTextArea = styled.div`
    background-color: #f3f2f2;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 8px 16px;
    border-radius: 4px;
    margin-bottom: 8px;
`;

const UserName = styled.p`
  font-size: 10px;
  font-weight: 600;  
  margin-top: 0px;
  margin-bottom: 0px;
`;


