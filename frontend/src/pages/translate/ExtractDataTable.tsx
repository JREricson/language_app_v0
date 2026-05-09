import { Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Title from "../../components/reuseable/Title";
import { WEBSITE_NAME } from "../../common/global_app_constants";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
  DataTableValueArray,
} from "primereact/datatable";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import ExpandedWordDataTableRow, {
  Definition,
} from "./ExpandedWordDataTableRow";
import { useState } from "react";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import React from "react";
import { FilterMatchMode } from "primereact/api";

//Typing
//////////////
// todo move userUnderstanding elsewhere
enum UserUnderstanding { // todo move this elsewhere and base off of the backend after know what to do with it.
  Unknown = "0 (Unknown)",
  BriefExposer = "1 (Brief Expose)",
  ModeratelyKnown = "2 (Moderately known)",
  WellKnown = "3 (Well known)",
  AlmostPerfected = "4 (Almost perfected)",
  Perfected = "5 (Perfected)",
  DoNotShowAgain = "6 (Do no show again",
}
export interface WordQuery {
  word: string;
  source_lang: string;
  trans_lang: string;
}

export type WordListItem = {
  id: number;
  orig?: string;
  trans?: string;
  lemma?: string;
  lemma_trans?: string;
  orig_count?: number;
  lemma_count_in_str?: number;
  orig_prct_in_str?: number;
  lemma_prct_in_str?: number;
  orig_prct_in_corpus?: number;
  lemma_prct_in_corpus?: number;
  user_lists?: string[];
  user_understanding?: UserUnderstanding;
  user_conj_understanding?: UserUnderstanding;
  pos?: string; //TODO- This could be an enum or type, but want flexibility for now
  example_sentences?: string[];
  source_lang?: string;
  trans_lang?: string;
  data?: any;
  definitions: Definition[];
  user_definitions?: Definition[];
};

export type WordListColumnMeta = {
  field: keyof WordListItem;
  header: string;
};

interface ExtractDataTableProps {
  word_list_details: WordListItem[];
}

const ExtractDataTable: React.FC<ExtractDataTableProps> = ({
  word_list_details,
}) => {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray
  >([]);

  const columns: WordListColumnMeta[] = [
    { field: "orig", header: "Original" },
    { field: "trans", header: "Quick translation" },
    { field: "orig_count", header: "Orig. word count" },
    { field: "pos", header: "Part of speech guess" },
    { field: "lemma", header: "Lemma guess" },
    { field: "lemma_trans", header: "Lemma translation" },
    { field: "lemma_count_in_str", header: "Lemma count in orig." },
    { field: "orig_prct_in_str", header: "Word % in orig" },
    { field: "lemma_prct_in_str", header: "Lemma % in orig." },
    { field: "orig_prct_in_corpus", header: "Word % in corpus" },
    { field: "lemma_prct_in_corpus", header: "Lemma % in corpus." },
    { field: "user_lists", header: "Lists" },
    { field: "user_understanding", header: "Understanding category" },
    { field: "user_conj_understanding", header: "Conj. understanding" },
  ];
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orig: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // TODO - add these, get size right, and get global working
    // "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // representative: { value: null, matchMode: FilterMatchMode.IN },
    // status: { value: null, matchMode: FilterMatchMode.EQUALS },
    // verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [visibleColumns, setVisibleColumns] =
    useState<WordListColumnMeta[]>(columns);

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter(
      (col) =>
        selectedColumns.some((sel_col: any) => sel_col.field === col.field) // TODO -fix the any?
    );

    setVisibleColumns(orderedSelectedColumns);
  };

  const add_sel_to_user_list = (
    <Card>
      Add Selected items to list:
      <MultiSelect
        value={visibleColumns}
        options={columns}
        optionLabel="header"
        onChange={onColumnToggle}
        className="sm:w-20rem"
        placeholder="Select Columns to show"
        display="chip"
      />
    </Card>
  );
  const col_section = (
    <Card>
      Column Selection
      <MultiSelect
        value={visibleColumns}
        options={columns}
        optionLabel="header"
        onChange={onColumnToggle}
        // className="sm:w-20rem"
        placeholder="Select Columns to show"
        display="chip"
      />
    </Card>
  );

  const TableHeader = () => {
    const col_section = (
      <Card>
        Column Selection
        <MultiSelect
          value={visibleColumns}
          options={columns}
          optionLabel="header"
          onChange={onColumnToggle}
          // className="sm:w-20rem"
          placeholder="Select Columns to show"
          display="chip"
        />
      </Card>
    );
    // @ts-ignore
    const value = filters["global"] ? filters["global"].value : "";
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters = { ...filters };
      // ignore is from the docs, not questioning it
      // @ts-ignore
      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
    };

    return (
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          value={value || ""}
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Global Search"
        />
      </IconField>
    );
  };

  const [selectedItems, setSelectedItems] = useState<WordListItem[] | null>(
    null
  );

  return (
    <Card>
      {/* <div className="flex justify-content-center align-items-center mb-4 gap-2">
            <InputSwitch
              inputId="input-rowclick"
              checked={rowClick}
              onChange={(e: InputSwitchChangeEvent) => setRowClick(e.value!)}
            />
            <label htmlFor="input-rowclick">Row Click</label>
          </div> */}
      {/* TODO - below is for csv */}
      {/* <Button
            type="button"
            icon="pi pi-file"
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          /> */}
      <br />
      {add_sel_to_user_list}
      <br />
      {col_section}
      <DataTable
        stripedRows
        showGridlines
        value={word_list_details}
        selectionMode={"checkbox"}
        selection={selectedItems!}
        onSelectionChange={(e: any) => setSelectedItems(e.value)}
        dataKey="id"
        size="small"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        removableSort
        sortField="orig_count" // <---- not doing anything
        sortOrder={1}
        sortMode="multiple"
        filters={filters} //<---- get working!!!
        filterDisplay="row"
        tableStyle={{ minWidth: "150rem" }}
        header={TableHeader}
        scrollable
        lazy // <-- todo test this
        // row expansion
        expandedRows={expandedRows}
        onRowToggle={(e) => {
          setExpandedRows(e.data);
        }}
        rowExpansionTemplate={ExpandedWordDataTableRow} // Todo -> get working

        // showGridlines => not working
        // loading={loading}
        // scrollable scrollHeight="500px"// posible to load based on page size? -> yes,
        // scrollable scrollHeight="flex"
      >
        {/* todo - set conditional on expander={true/false} and add dict/ example sentence options, etc */}
        <Column expander style={{ width: "5rem" }} />
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
          frozen
          alignFrozen="left"
        ></Column>
        <Column
          // filter
          // filterPlaceholder="Filter"
          key={"orig"}
          field={"orig"}
          header={"word"}
          sortable
          frozen
          className="font-bold" // todo freezing column not working
          // alignFrozen="left"
          // dataKey="orig"
        />
        {visibleColumns.map(
          (
            col // todo separate out each col and handle separately visibleColumns.includes(col) &&
          ) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              sortable
            />
          )
        )}
      </DataTable>
    </Card>
  );
};

export default ExtractDataTable;
