export default function useKeyWordGen() {
  const createKeywords = name => {
    const arrName: string[] = [];
    let curName = "";
    name.split("").forEach(letter => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  const generateKeywords = name => {
    const [first] = name;

    const keywordFullName = createKeywords(`${first}`);

    return [...new Set(["", ...keywordFullName])];
  };

  return { generateKeywords };
}
