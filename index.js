const pdfGenerator = require("./pdf");
const fs = require("fs");

/**
 * Cloud Function triggered by Pub/Sub.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.pdfCloudFunctionOnPubSub = (data, context) => {
  console.log("Function triggered with:");
  console.log({ data, context });

  (async () => {
    const pdf = await pdfGenerator.generate({
      isDev: false,
      data: data.data,
    });

    if (pdf) {
      // we can also here call the gcp storage to save the pdf :)
      // @google-cloud/storage
      fs.writeFileSync("./report.pdf", pdf);

      console.info("Pdf saved 🎉");
    } else {
      console.error("No pdf 😢");
    }
  })();
};
