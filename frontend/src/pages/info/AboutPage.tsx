import { Col, Container, Row } from "react-bootstrap";
import Title from "../../components/reuseable/Title";
import { WEBSITE_NAME } from "../../common/global_app_constants";
const PropertiesPage = () => {
  return (
    <>
      <Title title={`Learn more about ${WEBSITE_NAME}`} />
      <Container>
        <Row>
          <Col className="mg-top">
            <h1>Content to Come</h1>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PropertiesPage;
