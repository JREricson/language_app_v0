import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Profile from "../../components/Profile";
import Spinner from "../../components/Spinner";
import Title from "../../components/Title";
import { getProfiles, reset } from "../../features/profiles/profileSlice";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ProfilePublic from "../../type_interfaces/ProfilePublic";
import { ReducerStatus } from "../../common/ReducerStatus";

const ProfilesPage = () => {
  const { profiles, status, err_message, pagination } = useAppSelector(
    (state) => state.profiles
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(getProfiles());
    if (err_message !== "") {
      toast.error(err_message);
    }
  }, []);

  if (ReducerStatus.Loading === status) {
    return <Spinner />;
  }
  return (
    <>
      <Title title="LanguaVersity user profiles" />
      <h1>profile page</h1>
      <Container>
        <Row className="mg-top text-center">
          <h1>User Profiles</h1>
          <hr className="hr-text" />
        </Row>

        {
          <>
            {/* <p>p:{JSON.stringify(profiles)}</p> */}

            {profiles.map((profile: ProfilePublic) => (
              <>
                <Row key={profile.id}>
                  <Profile profile={profile} />
                </Row>
                <br />
              </>
            ))}
          </>
        }
      </Container>
    </>
  );
};

export default ProfilesPage;
