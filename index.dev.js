const pdfGenerator = require("./pdf");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("mockData.json"));

(async () => {
  const pdf = await pdfGenerator.generate({ isOnlyServe: true, data });

  if (pdf) {
    fs.writeFileSync("./report.pdf", pdf);
    console.info("Pdf saved 🎉");
  } else {
    console.info("No pdf 😢");
  }
})();
