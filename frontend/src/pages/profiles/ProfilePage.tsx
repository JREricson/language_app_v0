import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Spinner from "../../components/reuseable/Spinner";
import Title from "../../components/reuseable/Title";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePrivate from "../../type_interfaces/ProfilePrivate";
import { fetchOptionsWithStoredToken } from "../../common/utils/utils";
import country_lookup from "country-code-lookup";
import { LANGUAGES_CODES_KV } from "../../external/api/languages-recognized";
import moment from "moment";
import { WEBSITE_NAME } from "../../common/global_app_constants";

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;
// Todo -- try to remove global variables here and in edit profile
let lang_detail: string[] | null = null;
let profile_global: null | ProfilePrivate = null;
const ProfilePage = () => {
  let [profile, setProfile] = useState<ProfilePrivate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user_id } = useParams<string>();
  const navigate = useNavigate();
  let is_user_owned: boolean =
    user_id === "user" || user_id == localStorage.getItem("user_id");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const options = fetchOptionsWithStoredToken();
      try {
        let res = null;

        if (is_user_owned) {
          res = await fetch(
            `${REACT_APP_API_PATH}profile/current_user`,
            options
          );
        } else {
          res = await fetch(`${REACT_APP_API_PATH}profile/${user_id}`, options);
        }

        if (!res.ok) {
          toast.error("could not find profile");
          navigate("/404");
        }

        const data = await res.json();
        console.log(data.profile);
        setProfile(data.profile);
        profile_global = data.profile;

        const lang_ndx = LANGUAGES_CODES_KV.findIndex((kv) => {
          return kv[0] === profile_global?.native_language;
        });
        console.log("the index is");
        console.log(lang_ndx);

        lang_detail = LANGUAGES_CODES_KV[lang_ndx];
        if (lang_detail) {
          console.log("The language is ");
          console.log(lang_detail[1]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("An error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  if (errorMsg) {
    toast.error(errorMsg);
    return <div>Error: {errorMsg}</div>;
  }

  if (!profile) {
    toast.error("Could not locate profile");
    console.log("on profile pg");
    return <div>Problem Finding Profile...</div>;
  }

  return (
    <div className="centered-content">
      <Title title={`${WEBSITE_NAME} user profiles`} />

      <Row>
        <Col className=" col-12 col-md-4">
          <img
            className="profile-thumb"
            src="http://localhost:8080/staticfiles/profile_default.svg"
            alt="profile photo"
          />
        </Col>

        {/* TODO -- get photo working */}
        <Col className="col-12 col-md-8">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Profile:</strong> {profile.about_me}
          </p>
          <p>
            <strong>Current Country: </strong>
            {country_lookup.byIso(profile.country)?.country}
          </p>
          <p>
            <strong>Native Language: </strong> {lang_detail && lang_detail[1]}
          </p>
          {user_id === "user" && (
            <p>
              <strong>Email:</strong>
              {profile?.email}
            </p>
          )}
          <p>
            <strong>Joined On : </strong>{" "}
            {moment(profile.date_joined).format("L")}
          </p>
          {is_user_owned && <a href="/profile/edit">Edit Profile</a>}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
