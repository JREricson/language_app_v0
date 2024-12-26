import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileCard from "../../components/ProfileCard";
import Spinner from "../../components/Spinner";
import Title from "../../components/Title";
import { getProfiles, reset } from "../../features/profiles/profileSlice";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ProfilePublic from "../../type_interfaces/ProfilePublic";
import { ReducerStatus } from "../../common/ReducerStatus";
import { useSearchParams } from "react-router-dom";
import { addParamToRoute, paramStrFromURL } from "../../common/utils";
import { profile_paths } from "./ProfileRoutes";

const ProfilesPage = () => {
  const { profiles, status, err_message, pagination } = useAppSelector(
    (state) => state.profiles
  );

  const dispatch = useAppDispatch();
  let key_ndx = 0;

  const [searchParams] = useSearchParams();
  useEffect(() => {
    dispatch(reset());
    dispatch(getProfiles(searchParams.toString()));
    if (err_message !== "") {
      toast.error(err_message);
    }
  }, []);

  if (ReducerStatus.Loading === status) {
    return <Spinner />;
  }
  return (
    <>
      <div className="centered-content">
        <Title title="LanguaVersity user profiles" />
        <h1>Profile Search</h1>
        <h1>User Profiles</h1>
        <hr key={key_ndx} className="hr-text" />

        {profiles.map((profile: ProfilePublic) => (
          <div className="Profiles-card" key={profile.user_id + ++key_ndx}>
            <Row>
              <ProfileCard
                key={profile.user_id + ++key_ndx}
                profile={profile}
              />
            </Row>
            <br />
          </div>
        ))}
        <p>
          {/* TODO - add num of results per page and other pagination options, separate to reusable component */}
          {pagination?.previous && (
            <a
              href={addParamToRoute(
                profile_paths.all_profiles_pg.path,
                paramStrFromURL(pagination.previous)
              )}
            >
              Prev page
            </a>
          )}
          {pagination?.next && (
            <a
              href={addParamToRoute(
                profile_paths.all_profiles_pg.path,
                paramStrFromURL(pagination.next)
              )}
            >
              Next Page
            </a>
          )}
        </p>
      </div>
    </>
  );
};

export default ProfilesPage;
