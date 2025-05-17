const path = require("path");
const fs = require("fs");

const DOCS_PATH = path.resolve("docs");
const SIDEBAR_PATH = path.resolve(DOCS_PATH, "_sidebar.md");
const ALL_FILES_PATH = path.resolve(DOCS_PATH, "sekcje");

console.log(DOCS_PATH);

function getAllFilesToFix(directoryPath) {
  const result = [];
  const allToFix = fs.readdirSync(directoryPath);

  const directories = allToFix.filter((file) =>
    fs.statSync(path.resolve(directoryPath, file)).isDirectory()
  );

  directories.forEach((directory) => {
    result.push(...getAllFilesToFix(path.resolve(directoryPath, directory)));
  });

  const files = allToFix
    .filter((file) => fs.statSync(path.resolve(directoryPath, file)).isFile())
    .filter((file) => file.includes(".md"))
    .map((file) => path.resolve(directoryPath, file));

  return [...result, ...files];
}

function getSidebarUrlsFromContent() {
  const sidebarContent = fs.readFileSync(SIDEBAR_PATH, "utf8");
  const sidebarUrls = sidebarContent.match(/(\[.*?\]\((.*?)\))/g);
  const sidebarUrlsArray = sidebarUrls.map(
    (url) => url.split("(")[1].split(")")[0]
  );

  return sidebarUrlsArray;
}

function fixContent(file, sidebarUrls) {
  let fileContent = fs.readFileSync(file, "utf8");

  for (const sidebarUrl of sidebarUrls) {
    const escapedSidebarUrl = sidebarUrl
      .replaceAll(".", "\\.")
      .replaceAll("/", "\\/");

    fileContent = fileContent.replace(
      new RegExp(`\\(${escapedSidebarUrl}`, "i"),
      () => `(${sidebarUrl}`
    );
  }

  fs.writeFileSync(file, fileContent);
}

async function bootstrap() {
  const files = getAllFilesToFix(ALL_FILES_PATH);
  const sidebarUrls = getSidebarUrlsFromContent();

  for (const file of files) {
    fixContent(file, sidebarUrls);
  }
}

bootstrap();
