import { Button, Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { ChangeEvent, FormEvent, useState } from "react";
import DropDownFormSelection, {
  DropDownFormItem,
} from "../components/reuseable/DropDownFormSelection";
import React from "react";

import { GOOGLE_LANG_OBJ } from "../common/types/lang_codes";
import { Link } from "react-router-dom";
const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslateModal: React.FC<TranslateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [input_str, setInputStr] = useState<string>("enter a value");
  const [output_str, setOutputStr] = useState<string>("");
  const [res_data, setResData] = useState<any>("");
  let s_lang = "en";
  let o_lang = "en";
  const s_lang_loc_store = localStorage.getItem("trans_s_lang");
  if (s_lang_loc_store != null) {
    s_lang = s_lang_loc_store;
  }
  const o_lang_loc_store = localStorage.getItem("trans_o_lang");
  if (o_lang_loc_store != null) {
    o_lang = o_lang_loc_store;
  }

  const [source_lang, setSourceLang] = useState<string>(s_lang);
  const [output_lang, setOutputLang] = useState<string>(o_lang);

  const handleSourceLangSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSourceLang(event.target.value);
    localStorage.setItem("trans_s_lang", event.target.value);
  };
  const handleOutputLangSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOutputLang(event.target.value);
    localStorage.setItem("trans_o_lang", event.target.value);
  };

  const handleUpdateUserInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputStr(event.target.value);
  };

  const handleUpdateUserOutput = (event: ChangeEvent<HTMLInputElement>) => {
    setOutputStr(event.target.value);
  };

  const handleTranslateInApp = async (
    event: FormEvent,
    reverse_trans: boolean
  ) => {
    event.preventDefault();
    let g_translate_api_url = "";
    if (reverse_trans) {
      g_translate_api_url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${output_lang}&tl=${source_lang}&q=${encodeURIComponent(
        output_str
      )}`;
    } else {
      g_translate_api_url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${source_lang}&tl=${output_lang}&q=${encodeURIComponent(
        input_str
      )}`;
    }

    const response = await fetch(g_translate_api_url);

    try {
      if (!response.ok) {
        console.log("fail to get resource");
      }
      const data_json = await response.json();

      let output;
      if (data_json.length > 0) {
        output = data_json[0];
      } else {
        output = "--<Problem Translating>--";
      }

      setResData(data_json);
      if (data_json != undefined) {
        if (reverse_trans) {
          setInputStr(output);
          const input_box = document.getElementById(
            "input-box"
          ) as HTMLInputElement;
          if (input_box != null && input_box) {
            input_box.value = output;
          }
        } else {
          setOutputStr(output);
          const output_box = document.getElementById(
            "output-box"
          ) as HTMLInputElement;
          if (output_box != null && output_box) {
            output_box.value = output;
          }
        }
      }
    } catch (error: unknown) {
      const err_msg = "--<Problem Translating>--";
      if (reverse_trans) {
        setOutputStr(err_msg);
        const output_box = document.getElementById(
          "output-box"
        ) as HTMLInputElement;
        if (output_box != null && output_box) {
          output_box.value = err_msg;
        }
      } else {
        setOutputStr(err_msg);
        const output_box = document.getElementById(
          "output-box"
        ) as HTMLInputElement;
        if (output_box != null && output_box) {
          output_box.value = err_msg;
        }
      }
    }
  };

  let items: DropDownFormItem[] = [];
  GOOGLE_LANG_OBJ.forEach((entry) => {
    const code = Object.keys(entry)[0];
    const { en_name, native_lang } = entry[code];
    const new_item: DropDownFormItem = {
      display_str: `${en_name} -- <${native_lang}>`,
      value: `${code}`,
    };
    items.push(new_item);
  });

  return (
    <Modal
      show={isOpen}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Translate</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4>Select Source Language</h4>

        <DropDownFormSelection
          items={items}
          onChange={handleSourceLangSelection}
          default_option={source_lang}
        />

        <h4>Select Target Language</h4>

        <DropDownFormSelection
          items={items}
          onChange={handleOutputLangSelection}
          default_option={output_lang}
        />
        <br />
        <Form
          onSubmit={(event) => {
            handleTranslateInApp(event, false);
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Enter text to translate</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={handleUpdateUserInput}
              id="input-box"
              autoFocus
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Translate in app
          </Button>
          <br />
          <Link
            to={`https://translate.google.com/?sl=${source_lang}&tl=${output_lang}&text=${input_str}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Google translate
          </Link>
        </Form>
        <br />
        <h4>Translation</h4>
        <Form
          onSubmit={(event) => {
            handleTranslateInApp(event, true);
          }}
        >
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              id="output-box"
              rows={3}
              onChange={handleUpdateUserOutput}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Button variant="secondary" type="submit">
            Reverse translate in app
          </Button>
        </Form>
        <br />
      </Modal.Body>
      {/*  TODO - add option to save the result to a flashcard or list  */}
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TranslateModal;
