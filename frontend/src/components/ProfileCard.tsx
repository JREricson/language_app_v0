import React, { FC } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { FaBed, FaShower } from "react-icons/fa";
import { GiStairs } from "react-icons/gi";
import { Link } from "react-router-dom";

import { connect, ConnectedProps } from "react-redux";
import ProfilePublic from "../type_interfaces/ProfilePublic";
import { CountryCodes } from "validator/lib/isISO31661Alpha2";
import { addParamToRoute } from "../common/utils";
import { profile_routes } from "../pages/profiles/ProfileRoutes";
import moment from "moment";

// const connector = connect(mapState, mapDispatch)
// interface ProfileProp extends PropsFromRedux {
//   backgroundColor: string
// }

interface ProfileProps {
  profile: ProfilePublic;
}

const ProfileCard = ({ profile }: ProfileProps) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title className="user-name-title" as="h2">
          {/* //TODO center */}
          <strong>Username:</strong> {profile.username}
          {/* <strong>{profile.title}</strong> */}
        </Card.Title>

        <Row>
          <Col>
            {/* TODO remove hardcoded value for */}
            <img
              className="profile-thumb"
              src="http://localhost:8080/staticfiles/profile_default.svg"
              alt="profile photo"
            />
            {/* TODO --  adjust spacing of picture and text columns */}
            {/* TODO -- get photo working */}
          </Col>
          <Col>
            <Card.Text as="p">
              <strong>Full Name: </strong> {profile.first_name}{" "}
              {profile.last_name}{" "}
            </Card.Text>

            <Card.Text as="p">
              <strong>Profile:</strong> {profile.about_me.substring(0, 70)}...
            </Card.Text>
            <Card.Text as="p">
              <strong>Current Country: </strong> {profile.country}
            </Card.Text>
            <Card.Text as="p">
              <strong>Joined On : </strong>{" "}
              {moment(profile.date_joined).format("L")}
            </Card.Text>

            {/* TODO: highlight listener on link with text popup to show icon is link or something similar */}
            <Card.Text as="p">
              <Link
                to={addParamToRoute(
                  profile_routes.profile_pg.path,
                  profile.user_id
                )}
              >
                View Profile
              </Link>
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
