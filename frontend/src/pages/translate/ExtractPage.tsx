import { useState, useEffect, FormEvent, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
  DataTableValueArray,
} from "primereact/datatable";

import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePrivate from "../../type_interfaces/ProfilePrivate";
import {
  createFetchOptionsWithStoredToken,
  roundToN,
} from "../../common/utils/utils";
import Form from "react-bootstrap/Form";
import { StatusCodes } from "http-status-codes";
import DropDownFormSelection, {
  DropDownFormItem,
} from "../../components/reuseable/DropDownFormSelection";
import { GOOGLE_LANG_OBJ } from "../../common/types/lang_codes";

import ExtractDataTable, {
  WordListColumnMeta,
  WordListItem,
} from "./ExtractDataTable";
import { Column } from "primereact/column";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import ExpandedWordDataTableRow, {
  Definition,
} from "./ExpandedWordDataTableRow";

//todo filter on these for dict items
const SUPPORTED_LANGUAGES = ["en-es", "es-en"];

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;
// Todo -- try to remove global variables her and in edit profile

//TODO - May want to rename this page/module ie languageExtractionPage
const ExtractPage = () => {
  // internal funcs
  ////////////////

  interface StrDetail {
    count: number;
    indices: number[];
  }
  interface extractCountsType {
    word_map: Map<string, StrDetail>;
    tot_count: number;
  }

  function extractWordCounts(text: string): extractCountsType {
    const word_map: Map<string, StrDetail> = new Map();
    let tot_count = 0;
    // todo just extract words, not named entities - include that later
    // todo _ is extracted as a word, maybe delete
    // todo not extracting accented char fix!!!!!
    // TODO this currently keeps capitalization, maybe this is what is wanted.
    let word_list: string[] = text // source of regex: LLM
      // Replace all bracket types and underscores with space
      .toLowerCase()
      .replace(/[\[\]\(\)\{\}_]/g, " ")
      // Remove other punctuation except dashes and accented characters
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      // Split by whitespace
      .split(/\s+/)
      // Remove empty entries
      .filter(Boolean);
    for (let i = 0; i < word_list.length; i++) {
      if (word_map.has(word_list[i])) {
        const detail = word_map.get(word_list[i]);
        if (detail != undefined) {
          detail.count += 1;
          detail.indices.push(i);
        }
      } else {
        const detail: StrDetail = {
          count: 1,
          indices: [i],
        };
        word_map.set(word_list[i], detail);
      }
      tot_count += 1;
    }

    return { word_map, tot_count };
  }

  function create_trans_payload(word_list: string[]): string {
    // treats words as separate entities from one another
    // let output_str = "";
    const output_str = word_list.join("\n");
    return output_str;
  }

  async function callBilingualDictAPI(payload: object): Promise<any> {
    let fetch_options = createFetchOptionsWithStoredToken();
    fetch_options = {
      ...fetch_options,
      method: "POST",
      body: JSON.stringify(payload),
    };

    try {
      const word_detail_end_point: any = `${REACT_APP_API_PATH}dict/many`;
      const res = await fetch(word_detail_end_point, fetch_options); // todo ??? need to define an interface

      if (!res.ok) {
        if (res.status == StatusCodes.UNAUTHORIZED) {
          navigate("/login");
        } else {
          // TODO - how to best handle for good user experience
          const err_msg =
            "Problem obtaining resources. This is common when there is no internet access.";
          toast.error(err_msg);

          return [];
        }
      } else {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      if (err instanceof Error) {
        //todo handle this properly
        setErrorMsg(err.message);
        toast.error(err.message);
        console.log(err.message);
      } else {
        toast.error("error");
        setErrorMsg("An error collecting some of the needed information.");
      }
    }
  }

  async function callGetUserWordDetailsAPI(payload: object): Promise<any> {
    // have type for payload???
    // TODO - break this func and the bilingual one into abstracted apis
    let fetch_options = createFetchOptionsWithStoredToken();
    fetch_options = {
      ...fetch_options,
      method: "POST",
      body: JSON.stringify(payload),
    };

    try {
      const user_word_detail_end_point: any = `${REACT_APP_API_PATH}words/user_word_details`;
      const res = await fetch(user_word_detail_end_point, fetch_options); // todo ??? need to define an interface

      if (!res.ok) {
        if (res.status == StatusCodes.UNAUTHORIZED) {
          navigate("/login");
        } else {
          // TODO - how to best handle for good user experience
          const err_msg =
            "Problem obtaining resources. This is common when there is no internet access.";
          toast.error(err_msg);

          return [];
        }
      } else {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      if (err instanceof Error) {
        //todo handle this properly
        setErrorMsg(err.message);
        toast.error(err.message);
        console.log(err.message);
      } else {
        toast.error("error");
        setErrorMsg("An error collecting some of the needed information.");
      }
    }
  }

  //TODO find named entities in separate call on backend

  //////////////////
  // auth
  const { user_id } = useParams<string>();
  //app
  const navigate = useNavigate();
  // React state variables
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [input_text, setInputText] = useState<string>("");
  const [translated_text, setTranslatedText] = useState<null | string>(null);
  const [word_list_details, setWordListDetails] = useState<WordListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // todo  - get user lists
  const user_lists: Map<string, Set<string>> = new Map<string, Set<string>>([]);

  // used for selecting from datatable
  ///////////////////////////////////
  // const dt = useRef<DataTable>(null); <= todo get working
  // const exportCSV = (selectionOnly: unknown) => {  # <= todo get working
  //   dt.current.exportCSV({ selectionOnly });
  // };

  // collecting saved state from local storage
  let is_user_owned: boolean =
    user_id === "user" || user_id == localStorage.getItem("user_id");
  let { s_lang, o_lang } = getLanguagesFromSavedState();

  const [source_lang, setSourceLang] = useState<string>(s_lang);
  const [output_lang, setOutputLang] = useState<string>(o_lang);

  ///////////////////////

  function handleSetInputLang(event: React.ChangeEvent<HTMLSelectElement>) {
    setSourceLang(event.target.value);
    localStorage.setItem("extract_s_lang", event.target.value);
  }

  function handleSetOutputLang(event: React.ChangeEvent<HTMLSelectElement>) {
    setOutputLang(event.target.value);
    localStorage.setItem("extract_o_lang", event.target.value);
  }

  function processSingleWordGoogleTransResp(res: string[]): string[] {
    // should contain an array with a single value
    // know the line numbers

    if (res.length > 0) {
      const trans = res[0].split("\n");
      if (trans.length === 1 && trans[0] === "") {
        // todo verify that this does not have issues with no translations
        return [];
      } else {
        return trans;
      }
    } else {
      return [];
    }
  }

  async function translateIndividualWords(word_list: string[]) {
    const translate_payload: string = create_trans_payload(word_list);
    const G_TRANSLATE_URL = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${source_lang}&tl=${output_lang}&q=${encodeURIComponent(
      translate_payload
    )}`;

    const err_msg =
      "Problem obtaining resources. This is common when there is no internet access.";

    let trans_word_list: string[] = [];
    try {
      const response = await fetch(G_TRANSLATE_URL);
      if (!response.ok) {
        // TODO - Make sure that this is handles further down the pipeline
        toast.error(err_msg);
      }
      const data_json = await response.json();

      // todo => this looks ugly for user, handle differently
      trans_word_list = processSingleWordGoogleTransResp(data_json);
    } catch (error: unknown) {
      toast.error(err_msg);
    }
    return trans_word_list;
  }

  const handleTranslateIndividualWords = async (event: FormEvent) => {
    event.preventDefault();

    const { word_map, tot_count } = extractWordCounts(input_text);
    let word_list = Array.from(word_map.keys());
    if (word_list.length === 1 && word_list[0] === "") {
      word_list = [];
    }
    let trans_word_list: string[] = await translateIndividualWords(word_list);
    const user_detail_payload = {
      source_lang: source_lang,
      trans_lang: o_lang,
      words: word_list,
      do_include_stats: true,
      do_include_dates: true,
    };
    const user_word_details_obj = await callGetUserWordDetailsAPI(
      user_detail_payload
    );
     console.log("word_list"); // todo delete this

    console.log(word_list); // todo delete this
    let updated_word_list_items = [];
    const lemma_counts = new Map<string, number>();
    let tot_lemma_count = 0;
    for (let i = 0; i < word_list.length; i++) {
      const word = word_list[i];




      
      const word_res_obj = user_word_details_obj[word];
      console.log("user_word_details_obj"); // TODO -- delete this
      console.log(user_word_details_obj); // TODO -- delete this
      console.log("word"); // TODO -- delete this      
      console.log(word); // TODO -- delete this
      console.log("word_res_obj"); // TODO -- delete this
      console.log(word_res_obj); // TODO -- delete this
      if (word_res_obj == undefined) {
        // skipping words that are not in user_word_details
        continue;
      }
      const word_set = new Set(Object.keys(user_word_details_obj));
      let lemma: string = "No guess";
      let orig_prct_in_corpus = 0.0;
      let lemma_prct_in_corpus = 0.0;

      const str_count = word_map.get(word)?.count;
      let orig_prct_in_str = 0.0;

      if (str_count != undefined) {
        orig_prct_in_str = roundToN(str_count / tot_count, 3);
      } else {
      }

      if (
        word_set.has(word) &&
        user_word_details_obj[word]["source_word_stats"] != undefined
      ) {
        lemma = user_word_details_obj[word]["source_word_stats"]["lemma"];

        if (lemma != undefined) {
          const lemma_count = lemma_counts.get(lemma);
          if (lemma_count != undefined) {
            lemma_counts.set(lemma, lemma_count + 1);
          } else {
            lemma_counts.set(lemma, 1);
            tot_lemma_count++;
          }
        } else {
          tot_lemma_count++;
        }

        orig_prct_in_corpus = roundToN(
          parseFloat(
            user_word_details_obj[word]["source_word_stats"]["word_prct"]
          ),
          3
        );

        lemma_prct_in_corpus = roundToN(
          parseFloat(
            user_word_details_obj[word]["source_word_stats"]["lemma_prct"]
          ),
          3 // todo , doe the 3 do anything -> remove?
        );
      }
      const definitions: Definition[] = [];
      // if (
      //   word_set.has(word) &&
      //   // want to include the null values
      //   user_word_details_obj[word]["definitions"] !== undefined
      // ) {
      //   // const new_def_obj: Definition[];
      //   // console.log(
      //   //   "we got" + JSON.stringify(word_detail_obj[word]["definitions"])
      //   // );
      //   user_word_details_obj[word]["definitions"].forEach((def_obj: any) => {
      //     const gender = def_obj["gender"];
      //     const pos = def_obj["pos"];
      //     const definition = def_obj["translation"];
      //     const new_def: Definition = {
      //       gender,
      //       pos,
      //       definition,
      //     };
      //     definitions.push(new_def);
      //   });
      // }

      let detail: WordListItem = {
        id: i,
        orig: word_list[i],
        trans: trans_word_list[i],
        orig_count: word_map.get(word_list[i])?.count,
        lemma,
        orig_prct_in_corpus,
        lemma_prct_in_corpus,
        orig_prct_in_str,
        definitions,
      };

      updated_word_list_items.push(detail);
    }
    updated_word_list_items.forEach((det) => {
      if (det["lemma"] != undefined) {
        const lem_count = lemma_counts.get(det["lemma"]);
        if (lem_count != undefined) {
          det["lemma_count_in_str"] = lem_count;
          det["lemma_prct_in_str"] = (lem_count / tot_lemma_count) * 100;
        }
      }
    });
 
    setWordListDetails(updated_word_list_items);
  };

  const items: DropDownFormItem[] = [];
  GOOGLE_LANG_OBJ.forEach((entry) => {
    const code = Object.keys(entry)[0];
    const { en_name, native_lang } = entry[code];
    const new_item: DropDownFormItem = {
      display_str: `${en_name} -- <${native_lang}>`,
      value: `${code}`,
    };
    items.push(new_item);
  });

  function updateInputText(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    event.preventDefault();
    setInputText(event.currentTarget.value.trim());
  }

  /////////////////////
  ////////////////////////
  ///////////////////////
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray
  >([]);

  const columns: WordListColumnMeta[] = [
    { field: "orig", header: "Original" },
    { field: "trans", header: "Quick translation" },
    { field: "orig_count", header: "Orig. word count" },
    // { field: "pos", header: "Part of speech guess" },
    { field: "lemma", header: "Lemma guess" },
    // { field: "lemma_trans", header: "Lemma translation" },
    { field: "lemma_count_in_str", header: "Lemma count in orig." },
    { field: "orig_prct_in_str", header: "Word % in orig" },
    { field: "lemma_prct_in_str", header: "Lemma % in orig." },
    { field: "orig_prct_in_corpus", header: "Word % in corpus" },
    { field: "lemma_prct_in_corpus", header: "Lemma % in corpus." },
    { field: "user_lists", header: "Lists" },
    // { field: "user_understanding", header: "Understanding category" },
    { field: "user_conj_understanding", header: "Conj. understanding" },
  ];

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orig: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // TODO - add more filters in and add to data table
  });

  const [visibleColumns, setVisibleColumns] =
    useState<WordListColumnMeta[]>(columns);

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sel_col: any) => sel_col.field === col.field)
    );

    setVisibleColumns(orderedSelectedColumns);
  };
  const [delete_me, set_del_met] = useState<Definition>({
    definition: "test",
    gender: "get",
    pos: "none",
  });

  const exclude_lists = (
    <Card>
      Select Lists of words to exclude
      <MultiSelect
        value={visibleColumns}
        options={columns}
        optionLabel="header"
        onChange={onColumnToggle}
        placeholder="Select Columns to show"
        display="chip"
      />
    </Card>
  );
  const include_lists = (
    <Card>
      Select Lists of words to include
      <MultiSelect
        value={visibleColumns}
        options={columns}
        optionLabel="header"
        onChange={onColumnToggle}
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

  interface ExpandedWordDataTableRowExtensionProps {
    word_detail: WordListItem;
  }

  function ExpandedWordDataTableRowExtension({
    word_detail,
  }: ExpandedWordDataTableRowExtensionProps) {
    const DeleteDefinitionBtn = () => {
      return <Button>Delete</Button>;
    };

    function add_defn() {
      set_del_met({
        definition: "bll ",
        gender: "monkey",
        pos: "none",
      });
    }

    return (
      <div className="p-3">
        <Card>Your translations</Card>
        <DataTable
          value={[
            {
              definition: "bubbles ",
              gender: "monkey",
              pos: "none",
            },
          ]}
        >
          <Column
            headerStyle={{ width: "4rem" }}
            body={DeleteDefinitionBtn}
          ></Column>

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
        <p>{word_detail.orig}</p>
        <p> {JSON.stringify(delete_me)}</p>
        <Button onClick={add_defn}>Add Definition</Button>{" "}
      </div>
    );
  }

  function ExpandedWordDataTableRow2(word_query: WordListItem) {
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
        <ExpandedWordDataTableRowExtension word_detail={word_query} />
      </div>
    );
  }

  return (
    <div className="centered-content">
      <Form onSubmit={handleTranslateIndividualWords}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>The text in the field below will translated.</Form.Label>
          <Form.Control
            name="to_trans_text"
            as="textarea"
            onChange={updateInputText}
            placeholder={"Enter text to translate here"}
          />
        </Form.Group>
        <Button type="submit">Translate </Button>
        <Button>Extract Named Entities </Button>
      </Form>

      <Form.Group>
        <Form.Label>Translate from:</Form.Label>
        <DropDownFormSelection
          items={items}
          onChange={handleSetInputLang}
          default_option={source_lang}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Translate to:</Form.Label>
        <DropDownFormSelection
          items={items}
          onChange={handleSetOutputLang}
          default_option={output_lang}
        />
      </Form.Group>
      <br />
      <Card>
        {translated_text && <Card.Title>Translated Text</Card.Title>}
        {translated_text && <Card.Text>{translated_text}</Card.Text>}
      </Card>
      <div className="card">
        {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}

        <Card>Todo - create plot and stats for words known</Card>
        <br />
        <Card>
          <br />
          {include_lists}
          {col_section}
          {/* <Button          <======================================  TODO get working
              type="button"
              onClick={() => exportCSV(false)}
              data-pr-tooltip="CSV"
            /> */}
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
            rows={25}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            // sortField="orig_count" // <---- not doing anything
            // sortOrder={-1}
            sortMode="multiple"
            filters={filters} //<---- get working!!!
            filterDisplay="row"
            tableStyle={{ minWidth: "150rem" }}
            // header={TableHeader}
            scrollable
            // row expansion
            expandedRows={expandedRows}
            onRowToggle={(e) => {
              setExpandedRows(e.data);
            }}
            rowExpansionTemplate={ExpandedWordDataTableRow2} // Todo -> get working
            // loading={loading} // <= todo get working
          >
            <Column expander style={{ width: "5rem" }} />
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
              frozen
              alignFrozen="left"
            ></Column>
            <Column
              // filter
              // filterPlaceholder="Filter" <= todo add filters in
              key={"orig"}
              field={"orig"}
              header={"word"}
              sortable
              frozen
              className="font-bold"
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

        {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      </div>
    </div>
  );
};

export default ExtractPage;

function getLanguagesFromSavedState() {
  let s_lang = "en";
  let o_lang = "en";
  const s_lang_loc_store = localStorage.getItem("extract_s_lang");
  if (s_lang_loc_store != null) {
    s_lang = s_lang_loc_store;
  }
  const o_lang_loc_store = localStorage.getItem("extract_o_lang");
  if (o_lang_loc_store != null) {
    o_lang = o_lang_loc_store;
  }
  return { s_lang, o_lang };
}
// const handleTranslateIndividualWords = async (event: FormEvent) => {
//   event.preventDefault();
//   const { word_map, tot_count } = extractWordCounts(input_text);
//   let word_list = Array.from(word_map.keys());
//   if (word_list.length === 1 && word_list[0] === "") {
//     word_list = [];
//   }

//   const translate_payload: string = create_trans_payload(word_list);
//   const g_translate_api_url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${source_lang}&tl=${output_lang}&q=${encodeURIComponent(
//     translate_payload
//   )}`;

//   const err_msg =
//     "Problem obtaining resources. This is common when there is no internet access.";

//   let trans_word_list: string[] = [];
//   try {
//     const response = await fetch(g_translate_api_url);
//     if (!response.ok) {
//       // TODO - Make sure that this is handles further down the pipeline
//       toast.error(err_msg);
//     }
//     const data_json = await response.json();

//     // todo => this looks ugly for user, handle differently
//     trans_word_list = processSingleWordTransResp(data_json);
//   } catch (error: unknown) {
//     toast.error(err_msg);
//   }

//   const payload = {
//     source_lang_code: source_lang,
//     words: word_list,
//     trans_lang_code: o_lang,
//     do_include_stats: true,
//   };

//   const user_detail_payload = {
//     source_lang: source_lang,
//     trans_lang: o_lang,
//     words: word_list,
//     do_include_stats: true,
//     do_include_dates: true,
//   };

//   const word_detail_obj = await callBilingualDictAPI(payload);
//   const user_word_detail_obj = await callGetUserWordDetailsAPI(
//     user_detail_payload
//   );

//   let new_word_list_items = [];
//   const lemma_counts = new Map<string, number>();
//   let tot_lemma_count = 0;
//   for (let i = 0; i < word_list.length; i++) {
//     // containing in wordlist is 0(n) opp want o(1)
//     const word_set = new Set(Object.keys(word_detail_obj));
//     let lemma: string = "No guess";
//     let orig_prct_in_corpus = 0.0;
//     let lemma_prct_in_corpus = 0.0;
//     const word = word_list[i];
//     const str_count = word_map.get(word)?.count;
//     let orig_prct_in_str = 0.0;

//     if (str_count != undefined) {
//       orig_prct_in_str = roundToN(str_count / tot_count, 3);
//     } else {
//     }

//     if (
//       word_set.has(word) &&
//       word_detail_obj[word]["source_word_stats"] != undefined
//     ) {
//       lemma = word_detail_obj[word]["source_word_stats"]["lemma"];

//       if (lemma != undefined) {
//         const lemma_count = lemma_counts.get(lemma);
//         if (lemma_count != undefined) {
//           lemma_counts.set(lemma, lemma_count + 1);
//         } else {
//           lemma_counts.set(lemma, 1);
//           tot_lemma_count++;
//         }
//       } else {
//         tot_lemma_count++;
//       }

//       orig_prct_in_corpus = roundToN(
//         parseFloat(word_detail_obj[word]["source_word_stats"]["word_prct"]),
//         3
//       );

//       lemma_prct_in_corpus = roundToN(
//         parseFloat(word_detail_obj[word]["source_word_stats"]["lemma_prct"]),
//         3 // todo , doe the 3 do anything -> remove?
//       );
//     }
//     const definitions: Definition[] = [];
//     if (
//       word_set.has(word) &&
//       // want to include the null values
//       word_detail_obj[word]["definitions"] !== undefined
//     ) {
//       // const new_def_obj: Definition[];
//       // console.log(
//       //   "we got" + JSON.stringify(word_detail_obj[word]["definitions"])
//       // );
//       word_detail_obj[word]["definitions"].forEach((def_obj: any) => {
//         const gender = def_obj["gender"];
//         const pos = def_obj["pos"];
//         const definition = def_obj["translation"];
//         const new_def: Definition = {
//           gender,
//           pos,
//           definition,
//         };
//         definitions.push(new_def);
//       });
//     }
//     let detail: WordListItem = {
//       id: i,
//       orig: word_list[i],
//       trans: trans_word_list[i],
//       orig_count: word_map.get(word_list[i])?.count,
//       lemma,
//       orig_prct_in_corpus,
//       lemma_prct_in_corpus,
//       orig_prct_in_str,
//       definitions,
//     };

//     new_word_list_items.push(detail);
//   }
//   new_word_list_items.forEach((det) => {
//     if (det["lemma"] != undefined) {
//       const lem_count = lemma_counts.get(det["lemma"]);
//       if (lem_count != undefined) {
//         det["lemma_count_in_str"] = lem_count;
//         det["lemma_prct_in_str"] = (lem_count / tot_lemma_count) * 100;
//       }
//     }
//   });
//   setWordListDetails(new_word_list_items);
// };
