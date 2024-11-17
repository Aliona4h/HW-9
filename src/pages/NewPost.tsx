import React from "react";
import UploadExhibit from "./UploadExhibits";
import { Container, Row, Col, Card } from "react-bootstrap";

const NewPost: React.FC = (): React.ReactElement => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body>
              <UploadExhibit />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewPost;
