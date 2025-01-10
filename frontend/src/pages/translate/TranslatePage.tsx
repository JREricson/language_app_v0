import { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

import { toast } from "react-toastify";

import Spinner from "../../components/Spinner";
import Title from "../../components/Title";

import ProfilePublic from "../../type_interfaces/ProfilePublic";

import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import ProfilePrivate from "../../type_interfaces/ProfilePrivate";
import { fetchOptionsWithStoredToken } from "../../common/utils/utils";
import country_lookup from "country-code-lookup";
import { extractContent } from "../../common/utils/utils";

import {
  LANGUAGES_CODES_KV,
  LANGUAGES_NAMES,
} from "../../external/api/languages-recognized";
import moment from "moment";
import Form from "react-bootstrap/Form";
import { getWordsWithApostrophe } from "../../common/utils/str_methods";
import { StatusCodes } from "http-status-codes";

const SUPPORTED_LANGUAGES = ["en"];

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;
// Todo -- try to remove global variables her and in edit profile
let lang_detail: string[] | null = null;
let profile_global: null | ProfilePrivate = null;
const TranslatePage = () => {
  // internal funcs
  ////////////////
  async function getDefinitions(lemma: string) {
    let data: null | Object = null;

    try {
      const res = await fetch(
        `https://en.wiktionary.org/api/rest_v1/page/definition/${lemma}`
      );

      const data = await res.json();
      if (!res.ok) {
        setTranslatedText("Problem getting definition");
        return null;
      } else {
        setTranslatedText(JSON.stringify(data));
      }
    } catch (err) {
      setTranslatedText("Problem getting definition");
      return null;
    }
    console.log("The string");
    console.log(
      extractContent(
        '<span class="form-of-definition use-with-mention" about="#mwt377" typeof="mw:Transclusion"><a rel="mw:WikiLink" href="/wiki/Appendix:Glossary#vocative_case" title="Appendix:Glossary">vocative</a> <a rel="mw:WikiLink" href="/wiki/Appendix:Glossary#singular_number" title="Appendix:Glossary">singular</a> of <span class="form-of-definition-link"><i class="Latn mention" lang="sh"><a rel="mw:WikiLink" href="/wiki/lov#Serbo-Croatian" title="lov">lov</a></i></span></span>'
      ) 
    );

    return data;
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log("submit was clicked");
    setIsLoading(true);
    const trans = getDefinitions("bubble");
    if (!!trans) {
    }

    const form_data = new FormData(event.target);
    const to_trans_text: string = form_data.get("to_trans_text") as string;
    const word_list: string[] = getWordsWithApostrophe(to_trans_text);
    let payload: object = {};
    setTranslatedText(word_list[0]);
    console.log(word_list);
    setIsLoading(false);
  }

  function generateWordsList(text: string) {}

  //////////////////
  let [profile, setProfile] = useState<ProfilePrivate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is_trans_api_loading, setIsTransApiLoading] = useState(false);
  const [is_trans_word_api_loading, setIsWordApiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user_id } = useParams<string>();
  let [translated_text, setTranslatedText] = useState<null | string>(null);
  let [res_json, setResJson] = useState<null | string>(null);
  const navigate = useNavigate();

  let is_user_owned: boolean =
    user_id === "user" || user_id == localStorage.getItem("user_id");

  useEffect(() => {
    // keeps casing, capital letter may be different than expected in certain languages, best to just to a case insensitive search

    setIsLoading(false);
  }, []);

  // if (isLoading) {
  //   return <Spinner />;
  // }
  // if (errorMsg) {
  //   toast.error(errorMsg);
  //   return <div>Error: {errorMsg}</div>;
  // }

  // if (!profile) {
  //   toast.error("Could not locate profile");
  //   console.log("on profile pg");
  //   return <div>Problem Finding Profile...</div>;
  // }

  return (
    <div className="centered-content">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>The text in the field below will translated.</Form.Label>
          <Form.Control
            name="to_trans_text"
            as="textarea"
            // defaultValue={profile.about_me}
            placeholder={"Enter text to translate here"}
          />
        </Form.Group>
        <Button type="submit">Translate </Button>
      </Form>

      <Form.Group>
        <Form.Label>Translate from:</Form.Label>
        <Form.Select name="lang_from_code" size="sm">
          {LANGUAGES_NAMES.map((item: any) => {
            return (
              <option key={Object.keys(item)[0]}> {Object.keys(item)} </option>
            );
          })}
        </Form.Select>
      </Form.Group>
      <Form.Group>
        <Form.Label>Translate to:</Form.Label>
        <Form.Select name="lang_to_code" size="sm">
          {LANGUAGES_NAMES.map((item: any) => {
            return (
              <option key={Object.keys(item)[0]}> {Object.keys(item)} </option>
            );
          })}
        </Form.Select>
      </Form.Group>
      <br />
      <Card>
        {translated_text && <Card.Title>Translated Text</Card.Title>}
        {translated_text && <Card.Text>{translated_text}</Card.Text>}
      </Card>
    </div>
  );
};

export default TranslatePage;
