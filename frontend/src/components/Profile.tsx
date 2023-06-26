import React from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { FaBed, FaShower } from "react-icons/fa";
import { GiStairs } from "react-icons/gi";
import { Link } from "react-router-dom";

import { connect, ConnectedProps } from 'react-redux'


// const connector = connect(mapState, mapDispatch)
// interface ProfileProp extends PropsFromRedux {
//   backgroundColor: string
// }

const Profile = ({  }) => {




  return (
    <Card style={{ width: "18rem" }}>
            <Card.Body>
        <Card.Title as="h4">
          {/* <strong>{profile.title}</strong> */}
        </Card.Title>
        </Card.Body>


      {/* <Badge
        bg="success"
        className="position-absolute top-0 start-100 translate-middle rounded-pill"
      >
        {profile.advert_type}
      </Badge>
      <Link to={`/profile/${profile.slug}`}>
        <Card.Img src={profile.cover_photo} variant="top" />
      </Link>

      <Card.Body>
        <Card.Title as="h4">
          <strong>{profile.title}</strong>
        </Card.Title>

        <Card.Text as="p">
          {profile.description.substring(0, 70)}...
        </Card.Text>
        <hr />
        <Row>
          <Col className="d-flex justify-content-between">
            <span>
              <FaBed /> {profile.bedrooms}
            </span>
            <span>
              <FaShower /> {profile.bathrooms}
            </span>
            <span>
              <GiStairs /> {profile.total_floors}
            </span>
          </Col>
        </Row>
        <hr />
        <Link to={`/profile/${profile.slug}`}>
          <Button variant="primary">Get More Info &gt; &gt;</Button>
        </Link>
      </Card.Body> */}
    </Card>
  );
};

export default Profile;