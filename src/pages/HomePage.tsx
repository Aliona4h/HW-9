import React from "react";
import { fetchAllExhibits } from "../api/exhibits";
import { Alert, Card, Container, Row, Col } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useRequest } from "ahooks";

const HomePage: React.FC = () => {
  const { data: allPosts = [], error } = useRequest(fetchAllExhibits);

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error.message}</Alert>}

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {allPosts.map((post: any) => (
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
                  {post.description}
                </Card.Title>
                <Card.Text>
                  <small className="text-muted">
                    Posted by: {post.user.username}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
