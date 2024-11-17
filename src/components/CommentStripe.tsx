import React, { useState } from "react";
import { Button, Form, ListGroup, Alert } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { addComment, fetchComments, deleteComment } from "../api/comments";
import { getUserProfile } from "../api/userAction";
import { useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";

interface CommentStripeProps {
  exhibitId: string;
}

const CommentStripe: React.FC<CommentStripeProps> = ({ exhibitId }) => {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useRequest(getUserProfile, {
    onSuccess: (user) => setUserId(user.id),
    onError: (error) => {
      console.error("Failed to fetch user profile:", error);
      setUserId(null);
    },
  });

  const { data: comments = [], refresh } = useRequest(
    () => fetchComments(exhibitId),
    {
      onError: () => setError("Failed to fetch comments."),
    }
  );

  const { run: handleAddComment } = useRequest(
    () => addComment(exhibitId, newComment),
    {
      manual: true,
      onSuccess: (data) => {
        refresh();
        setNewComment("");
        setError(null);
      },
      onError: (error) => {
        setError("Failed to add comment.");
      },
    }
  );

  const { run: handleDeleteComment } = useRequest(
    (commentId: string) => deleteComment(exhibitId, commentId),
    {
      manual: true,
      onSuccess: () => refresh(), // Refresh comments after deleting
      onError: () => setError("Failed to delete comment."),
    }
  );

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to add a comment.");
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
    } else {
      handleAddComment();
    }
  };

  return (
    <div className="mt-4">
      <ListGroup className="mt-3">
        {comments.map(
          (comment: {
            id: string;
            user?: { id: string; username: string };
            text: string;
          }) => {
            const isOwner = userId === comment.user?.id;

            return (
              <ListGroup.Item
                key={comment.id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{comment.user?.username ?? "Anonymous"}:</strong>{" "}
                  {comment.text}
                </span>

                {isOwner && (
                  <Button
                    variant="cc-danger"
                    style={{ display: "inline-flex", alignItems: "center" }}
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </ListGroup.Item>
            );
          }
        )}{" "}
      </ListGroup>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <Form className="mt-3">
        <Form.Control
          as="input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button variant="primary" className="mt-2 w-100" onClick={handleSubmit}>
          Add Comment
        </Button>
      </Form>
    </div>
  );
};

export default CommentStripe;
