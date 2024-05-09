import React, { FC } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { FaBed, FaShower } from "react-icons/fa";
import { GiStairs } from "react-icons/gi";
import { Link } from "react-router-dom";

import { connect, ConnectedProps } from "react-redux";
import ProfilePublic from "../type_interfaces/ProfilePublic";

// const connector = connect(mapState, mapDispatch)
// interface ProfileProp extends PropsFromRedux {
//   backgroundColor: string
// }

interface ProfileProps {
  profile: ProfilePublic;
}

const Profile = ({ profile }: ProfileProps) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">
          {/* //TODO center */}

          <h2>{profile.username}</h2>

          {/* <strong>{profile.title}</strong> */}
        </Card.Title>

        <Row>
          <Col>
            {/* TODO remove hardcoded value for */}
            <img
              src="http://localhost:8080/staticfiles/profile_default.svg"
              alt="profile photo"
            />
            {/* TODO --  adjust spacing of picture and text columns */}
            {/* TODO -- get photo working */}
          </Col>
          <Col>
            <Card.Text as="p">
              <strong>Name: </strong> {profile.first_name} {profile.last_name}{" "}
            </Card.Text>

            <Card.Text as="p">{profile.about_me.substring(0, 70)}...</Card.Text>
            <Card.Text as="p">
              <strong>Current Country: </strong> {profile.country}
            </Card.Text>
            <Card.Text as="p">
              <strong>Joined on : </strong> {profile.date_joined}
            </Card.Text>

            {/* TODO: highlight listener on link with text popup to show icon is link or something similar */}
            <Card.Text as="p">
              <Link to={`/profile/${profile.id}`}> View Profile </Link>
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>

    // TODO -- add pagation links -- need to change payload first
  );
};

export default Profile;
