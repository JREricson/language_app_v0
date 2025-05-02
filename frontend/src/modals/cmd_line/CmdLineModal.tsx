import { Button, Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FormEvent, FormEventHandler, useState } from "react";

import React from "react";
import Select from "react-select";
import type { ActionMeta } from "react-select";

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

export interface CmdOption {
  display_str: string;
  value: string;
  handler: FormEventHandler<HTMLSelectElement>;
}
export interface opt {
  [key: string]: FormEventHandler<HTMLSelectElement>;
}

export interface CmdLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmd_options: CmdOption[];
}

interface SelectionOption {
  label: string;
  value: string;
}

export const CmdLineModal: React.FC<CmdLineModalProps> = ({
  isOpen,
  onClose,
  cmd_options,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const handler_map = new Map<string, any>();
  const handleValueSelection = (
    option: SelectionOption | null,
    actionMeta: ActionMeta<SelectionOption>
  ) => {
    if (option != undefined) {
      // setSelectedValue(option?.value);
      if (handler_map.has(option?.value)) {
        const opt_handler = handler_map.get(option?.value);
        if (opt_handler != undefined) {
          opt_handler();
        }
      }
    }
  };

  const selection_options: SelectionOption[] = []; // format { label: "Dictionary", value: "dict_modal" }

  cmd_options.forEach((opt) => {
    handler_map.set(opt.value, opt.handler);

    selection_options.push({ value: opt.value, label: opt.display_str });
  });

  function callSelectedHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (handler_map.has(selectedValue)) {
      const opt_handler = handler_map.get(selectedValue);
      if (opt_handler != undefined) {
        opt_handler();
      }
    }
  }

  return (
    <Modal
      show={isOpen}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Command Line
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <Form onSubmit={callSelectedHandler}>
            <Select
              options={selection_options}
              onChange={handleValueSelection}
              isMulti={false}
              autoFocus
              placeholder="Filter results..."
            />
            <br />
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CmdLineModal;
