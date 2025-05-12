import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import Spinner from "../../components/reuseable/Spinner";
import Title from "../../components/reuseable/Title";
import { useNavigate, useParams } from "react-router-dom";
import {
  addParamToRoute,
  fetchOptionsWithStoredToken,
} from "../../common/utils/utils";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import ProfilePrivate from "../../type_interfaces/ProfilePrivate";
import country_lookup from "country-code-lookup";
import { profile_routes } from "./ProfileRoutes";

import {
  LANGUAGES_CODES,
  LANGUAGES_CODES_KV,
  LANGUAGES_NAMES,
} from "../../external/api/languages-recognized";
import moment from "moment";
import { WEBSITE_NAME } from "../../common/global_app_constants";

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

// TODO - get rid of the global
let profile_global: ProfilePrivate | null = null; // Todo -> probably do not need this anymore
let lang_detail: string[] | undefined = undefined;
const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfilePrivate | null>(null); // TODO - should this be const. it this why I need the global
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { profileId } = useParams<string>();
  const sorted_langs = LANGUAGES_NAMES;

  const callUpdateProfile = async (payload: object) => {
    let fetch_options = fetchOptionsWithStoredToken();
    fetch_options = {
      ...fetch_options,
      method: "PATCH",
      body: JSON.stringify(payload),
    };
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      toast.error(
        "There was a problem with your session. Try logging in again in order to access this functionality."
      );

      navigate("/login");
      return;
    }

    try {
      const profile_data_endpoint: string = `${REACT_APP_API_PATH}profile/${user_id}/`;
      const res = await fetch(profile_data_endpoint, fetch_options);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Problem updating profile");
        if (res.status == StatusCodes.UNAUTHORIZED) {
          navigate("/login");
        } else {
          return <div>Error - Status: {res.status} </div>;
        }
      } else {
        toast.success("Your Profile has been updated.");
        navigate(addParamToRoute(profile_routes.profile_pg.path, "user"));
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An error occurred");
      }
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    let payload: object = {};

    // creating payload based on input
    if (profile?.about_me !== formData.get("about_me")) {
      payload = { ...payload, about_me: formData.get("about_me") };
    }

    const lang_full: string = formData.get("lang_code") as string;
    const lang_ndx = LANGUAGES_CODES_KV.findIndex((kv) => {
      return kv[1] === lang_full;
    });

    const lang_code: string | undefined = LANGUAGES_CODES_KV[lang_ndx][0];
    if (profile?.native_language !== lang_code && lang_code != undefined) {
      payload = { ...payload, native_language: lang_code };
    }

    const country_full: string = formData.get("country_code") as string;
    const country_code: string | undefined =
      country_lookup.byCountry(country_full)?.iso2;
    if (profile?.country !== country_code && country_code != undefined) {
      payload = { ...payload, country: country_code };
    }

    // processing payload
    if (Object.keys(payload).length === 0) {
      toast.error("No changes have been made.");
    } else {
      callUpdateProfile(payload);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const options = fetchOptionsWithStoredToken();

      try {
        const profile_data_endpoint: string = `${REACT_APP_API_PATH}profile/current_user/`;
        const res = await fetch(profile_data_endpoint, options);

        if (!res.ok) {
          toast.error("Problem obtaining data");
          if (res.status == StatusCodes.UNAUTHORIZED) {
            navigate("/login");
          } else {
            return <div>Error - Status: {res.status} </div>;
          }
        }

        const data = await res.json();
        setProfile(data.profile);
        profile_global = data.profile;

        const lang_ndx = LANGUAGES_CODES_KV.findIndex((kv) => {
          return kv[0] === profile_global?.native_language;
        });
        lang_detail = LANGUAGES_CODES_KV[lang_ndx];
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
    return <div>Problem loading page...</div>;
  }

  if (!profile) {
    return <div>Problem loading page...</div>;
  }

  return (
    <div className="centered-content">
      <Title title={`${WEBSITE_NAME} user profiles`} />
      <br />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className="col-md-4 center-inside   ">
            {/* TODO - have this load the correct profile image */}
            <img
              className="profile-thumb"
              src="http://localhost:8080/staticfiles/profile_default.svg"
              alt="profile photo"
            />
            <p>Ability to add custom profile picture coming in later version</p>
          </Col>
          <Col className="col-md-8 ">
            <div className="centered-col-r">
              <p>
                <strong>Username: </strong> {profile.username}
              </p>
              <p>
                <strong>Full Name: </strong> {profile.first_name}{" "}
                {profile.last_name}
              </p>

              {profile.email && (
                <p>
                  <strong>Email:&nbsp;</strong>
                  {profile.email}
                </p>
              )}
              <p>
                <strong>Joined On : </strong>{" "}
                {moment(profile.date_joined).format("L")}
              </p>
            </div>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            Select your <strong>Current Country</strong>
          </Form.Label>
          <Form.Select name="country_code" size="lg">
            {country_lookup.byIso(profile.country) && (
              <option key={"0001"}>
                {country_lookup.byIso(profile.country)?.country}
              </option>
            )}
            {country_lookup.countries.map((item: any) => {
              return <option key={item.country}> {item.country} </option>;
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            Pick one option for your <strong>Native Language</strong>
          </Form.Label>
          <Form.Select name="lang_code" size="lg">
            {profile.native_language && (
              <option key={"0002"}>{lang_detail && lang_detail[1]}</option>
            )}
            {LANGUAGES_NAMES.map((item: any) => {
              return (
                <option key={Object.keys(item)[0]}>
                  {" "}
                  {Object.keys(item)}{" "}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            Edit the description to your <strong>About Me</strong> section
          </Form.Label>
          <Form.Control
            name="about_me"
            as="textarea"
            // Todo -- enforce max length on these based on table lengths
            defaultValue={profile.about_me}
            placeholder={`${profile.about_me}`}
          />
        </Form.Group>

        <Button type="submit">Update Profile </Button>
      </Form>
    </div>
  );
};

export default ProfileEditPage;
