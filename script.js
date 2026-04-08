const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let newContent = content
    .replace(/(Bebas Neue|Bebas\+Neue)/g, (match) => match === "Bebas Neue" ? "Cinzel" : "Cinzel:wght@400;500;600;700;800;900")
    .replace(/sans-serif/g, (match, offset, str) => {
      if (str.substring(Math.max(0, offset - 30), offset).includes("Cinzel")) {
        return "serif";
      }
      return match;
    });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log("Updated: " + filePath);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory("e:/projects/aakar2026-main/components/(User)");
