import { useEffect } from "react";
import { Row } from "react-bootstrap";
import { toast } from "react-toastify";
import ProfileCard from "../../components/ProfileCard";
import Spinner from "../../components/reuseable/Spinner";
import Title from "../../components/reuseable/Title";
import { getProfiles, reset } from "../../features/profiles/profileSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ProfilePublic from "../../type_interfaces/ProfilePublic";
import { ReducerStatus } from "../../common/ReducerStatus";
import { useSearchParams } from "react-router-dom";
import { addParamToRoute, paramStrFromURL } from "../../common/utils/utils";
import { profile_routes } from "./ProfileRoutes";
import { WEBSITE_NAME } from "../../common/global_app_constants";

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
        <Title title={`${WEBSITE_NAME} user profiles`} />
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
          {/* TODO - add search bar for all profiles */}
          {pagination?.previous && (
            <a
              href={addParamToRoute(
                profile_routes.all_profiles_pg.path,
                paramStrFromURL(pagination.previous)
              )}
            >
              Prev page
            </a>
          )}
          {pagination?.next && (
            <a
              href={addParamToRoute(
                profile_routes.all_profiles_pg.path,
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
