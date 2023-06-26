import React, { FC } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { FaBed, FaShower } from "react-icons/fa";
import { GiStairs } from "react-icons/gi";
import { Link } from "react-router-dom";

import { connect, ConnectedProps } from 'react-redux';
import ProfilePublic from '../type_interfaces/ProfilePublic';




// const connector = connect(mapState, mapDispatch)
// interface ProfileProp extends PropsFromRedux {
//   backgroundColor: string
// }

interface ProfileProps {

  profile: ProfilePublic;

}

const Profile = ({ profile }: ProfileProps) => {




  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title as="h4">
          {/* <strong>{profile.title}</strong> */}
        </Card.Title>
      </Card.Body>


      <Badge
        bg="success"
        className="position-absolute top-0 start-100 translate-middle rounded-pill"
      >
        {profile.first_name}
      </Badge>

      {/*  TODO * add below/}
      {/* <Link to={`/profile/${profile.slug}`}>
        <Card.Img src={profile.cover_photo} variant="top" />
      </Link> */}

      <Card.Body>
        <Card.Title as="h4">
          <strong>{profile.username}</strong>
        </Card.Title>

        <Card.Text as="p">
          {profile.about_me.substring(0, 70)}...
        </Card.Text>
        <hr />
        <Row>
          <Col className="d-flex justify-content-between">

          </Col>
        </Row>
        <hr />
        {/* <Link to={`/profile/${profile.slug}`}>
          <Button variant="primary">Get More Info &gt; &gt;</Button>
        </Link> */}
      </Card.Body>
    </Card>
  );
};

export default Profile;