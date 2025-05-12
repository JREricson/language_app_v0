import { toast } from "react-toastify";
import { fetchOptionsWithStoredToken } from "../common/utils/utils";

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

export async function call_bilingual_dict_api(
  word: string,
  source_lang: string,
  trans_lang: string
): Promise<Response> {
  const word_detail_end_point: any = `${REACT_APP_API_PATH}words/many`;

  const payload = {
    source_lang_code: source_lang,
    trans_lang_code: trans_lang,
    words: [word],
  };

  let fetch_options = fetchOptionsWithStoredToken();
  fetch_options = {
    ...fetch_options,
    method: "POST",
    body: JSON.stringify(payload),
  };

  const res = await fetch(word_detail_end_point, fetch_options);

  return res;
}
