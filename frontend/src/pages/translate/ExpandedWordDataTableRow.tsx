import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { WordListItem } from "./ExtractDataTable";
import { Button } from "react-bootstrap";
import { useEffect } from "react";

export interface Definition {
  pos: string;
  definition: string;
  gender: string;
}

export default function ExpandedWordDataTableRow(word_query: WordListItem) {


  function add_defn(){
    word_query.definitions.push({"definition": "test",
      "gender": "get",
      "pos": "none"});
  }

  return (
    <div className="p-3">
      <DataTable value={word_query.definitions}>
        <Column
          field="definition"
          header="Translation"
          style={{ width: "20%" }}
          sortable
        ></Column>
        <Column
          field="gender"
          header="Gender"
          style={{ width: "20%" }}
          sortable
        ></Column>
        <Column
          field="pos"
          header="Part of Speech"
          style={{ width: "60%" }}
          sortable
        ></Column>
      </DataTable>
      <Button onClick={add_defn}>Add Definition</Button>

    </div>
  );
}
