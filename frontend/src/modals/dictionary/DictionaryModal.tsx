import { Button, Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FormEvent, useEffect, useState } from "react";
import DropDownFormSelection, {
  DropDownFormItem,
} from "../../components/reuseable/DropDownFormSelection";
import React from "react";
import DictionaryItems from "./DictionaryItems";
import { toast } from "react-toastify";

import { LANGUAGE_TO_CODES_WIKTIONARY } from "../../common/types/lang_codes";
const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

interface DictModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DictionaryModal: React.FC<DictModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [word_query, setWordQuery] = useState<string>("");
  const [res_data, setResData] = useState<any>("");
  const word_input_ref = React.useRef<HTMLInputElement>(null);

  let dict_lang = "en";
  const loc_dict_lang = localStorage.getItem("dict_lang");
  console.log("item in storage is " + loc_dict_lang);

  dict_lang = loc_dict_lang != undefined ? dict_lang : "en";
  const [cur_language, setCurLanguage] = useState<string>(dict_lang);

  const handleNewLangSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurLanguage(event.target.value);
    localStorage.setItem("dict_lang", event.target.value);
    console.log("set lang s " + event.target.value);
  };

  const getDictItem = async (event: FormEvent) => {
    event.preventDefault();

    let url = `https://en.wiktionary.org/api/rest_v1/page/definition/${word_query}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
      }

      const data_json = await response.json();
      setResData(data_json);
    } catch (error: unknown) {
      toast.error("A problem occurred while trying to make your request.");
    }
  };
  useEffect(() => {
    if (word_input_ref != null && word_input_ref.current != null) {
      word_input_ref.current.focus();
    }
  }, [word_input_ref]);

  const updateWordQuery = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.preventDefault();
    setWordQuery(event.currentTarget.value.trim() as string);
  };

  let items: DropDownFormItem[] = [];
  for (const entry of LANGUAGE_TO_CODES_WIKTIONARY.entries()) {
    const new_item: DropDownFormItem = {
      display_str: `${entry[0]}`,
      value: `${entry[1]}`,
    };
    items.push(new_item);
  }

  return (
    <Modal
      show={isOpen}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Dictionary</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Note: The current service only provides definitions in english.
          Support for other languages is limited may be provided if enough
          people desire it.
        </p>
        <h4>Select Language</h4>

        <DropDownFormSelection
          items={items}
          onChange={handleNewLangSelection}
          default_option={cur_language}
        />
        <br />
        <Form onSubmit={getDictItem}>
          <Form.Group className="mb-3">
            <Form.Label>
              Enter word to define here (case sensitive). Example: "the one":
            </Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              onChange={updateWordQuery}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <h4>Results</h4>
        <DictionaryItems data={res_data} lang={cur_language} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DictionaryModal;
