import React from "react";
import { useSelector } from "react-redux";
import { Alert, Card, Container, Button, Row, Col } from "react-bootstrap";
import { useRequest } from "ahooks";
import axiosInstance from "../api/axiosInstance";
import { fetchUserPosts, removeExhibit } from "../api/exhibits";

const MyPosts: React.FC = () => {
  const currentUser = useSelector((state: any) => state.auth.user);

  const {
    data: myPosts = [],
    error: fetchError,
    refresh,
  } = useRequest(fetchUserPosts, {
    refreshDeps: [currentUser],
    onError: () => {
      console.error("Failed to load posts.");
    },
  });

  const { run: handlePostRemoval } = useRequest(
    (postId: string) => removeExhibit(postId),
    {
      manual: true,
      onSuccess: () => {
        refresh();
      },
      onError: () => console.error("Failed to remove post."),
    }
  );

  return (
    <Container className="mt-4">
      {fetchError && <Alert variant="danger">Failed to load posts.</Alert>}

      <Row xs={1} sm={2} md={3} className="g-4">
        {myPosts.map(
          (post: {
            id: string;
            imageUrl: string;
            description: string;
            user: {
              username: string;
            };
          }) => (
            <Col key={post.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`${axiosInstance.defaults.baseURL}${post.imageUrl}`}
                  alt={post.description}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="text-primary">
                    Post ID: {post.id}
                  </Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Posted by: {post.user.username}
                    </small>
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center">
                  <Button
                    variant="outline-danger"
                    onClick={() => handlePostRemoval(post.id)}
                  >
                    Delete Post
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          )
        )}
      </Row>
    </Container>
  );
};

export default MyPosts;
