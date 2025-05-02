import { Card } from "react-bootstrap";

function cleanAndFlattenHTML(htmlString: string): string {
  let div = document.createElement("div");
  div.innerHTML = htmlString;
  const cleaned = div.textContent || div.innerText || "";
  return cleaned;
}

const DictionaryItems = (props: any) => {
  if (!props["data"]) {
    return <p>Word not found.</p>;
  }
  if (!props["data"][props.lang]) {
    return <p>Word not found in current language selection.</p>;
  }
  let ndx = 1;
  try {
    return (
      <div>
        {props["data"][props.lang].map((pos_entry: any) => {
          return (
            <>
              {pos_entry["definitions"].map((def: any) => {
                return (
                  <Card className="definition-card">
                    <>
                      <p>
                        <strong>Definition {ndx++}</strong>
                      </p>

                      <p>
                        <strong>{pos_entry["partOfSpeech"]}:</strong>{" "}
                        {cleanAndFlattenHTML(def["definition"])}
                      </p>

                      {def["examples"] &&
                        def["examples"].map((example: any) => {
                          return (
                            <>
                              <strong>Example</strong>
                              <p>{cleanAndFlattenHTML(example)}</p>
                            </>
                          );
                        })}
                    </>
                  </Card>
                );
              })}
            </>
          );
        })}
      </div>
    );
  } catch (error) {
    return (
      <>
        <p>"problem Loading data"</p>
      </>
    );
  }
};

export default DictionaryItems;
