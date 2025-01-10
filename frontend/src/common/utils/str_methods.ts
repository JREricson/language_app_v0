export function getWordsWithApostrophe(text: string): string[] {
  const pattern = /(\b[^\s]+\b)/gi;
  //TODO -- this pattern is not well tested and may miss some combinations
  //        for example it will not catch anything that begins with an apostrophe
  const matches = text.matchAll(pattern);
  console.log(pattern);

  let results: string[] = [];
  for (const match of text.matchAll(pattern)) {
    results.push(match[0]);
  }
  return results;
}

// const text = "Hello world, hello again!";
// const regex = /hello/gi; // 'g' flag for global search, 'i' flag for case-insensitive
// const matches = text.match(regex);
