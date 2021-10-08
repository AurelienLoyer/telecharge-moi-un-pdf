"use strict";
const PORT = 9002;
const puppeteerOptions = { headless: true };
const browsingTimeOut = 300001;
const pageGotoOptions = {
  waitUntil: ["load", "networkidle0", "domcontentloaded"],
};

const fs = require("fs");
const express = require("express");
const pdfLib = require("pdf-lib");
const puppeteer = require("puppeteer");

exports.generate = async ({ isOnlyServe = false, data }) => {
  // usage of express to serve the app
  const app = express();

  // mock api calls
  app.use("/api/content", (req, res) => {
    console.info("API call triggered 😲");
    return res.json(data);
  });

  // mock images calls
  app.use("/images/:imageId", (req, res) => {
    console.info(`IMAGE ${req.params.imageId} call triggered 😲`);

    // return the image from the storage @google-cloud/storage
    const stream = fs.createReadStream("sample.jpeg");

    stream.pipe(res);
  });

  // serve static files
  app.use(express.static("www"));

  // creation of promise to say ok or nok to the functions / ack ...
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, async () => {
      try {
        console.info(`Starting application on:`);
        console.info(`http://127.0.0.1:${PORT}/`);

        if (isOnlyServe) {
          return;
        }

        // puppeteer WTF 💪
        const browser = await puppeteer.launch(puppeteerOptions);
        const browserVersion = await browser.version();

        console.info(`Launched '${browserVersion}'`);

        const page = await browser.newPage();
        await page.setDefaultTimeout(browsingTimeOut);
        await page.setDefaultNavigationTimeout(browsingTimeOut);

        // if u need to fake the user
        // await page.setCookie(cookie);

        const reportPrintUrl = `http://127.0.0.1:${PORT}/`;
        console.info(
          `Going to '${reportPrintUrl}' with options '${JSON.stringify(
            pageGotoOptions
          )}'...`
        );
        const reportPrintResponse = await page.goto(
          reportPrintUrl,
          pageGotoOptions
        );
        console.info(
          `Loaded '${reportPrintUrl}' - status: ${reportPrintResponse.status()} - ${reportPrintResponse.statusText()}`
        );

        const pdfPages = await page.pdf({
          format: "A4",
          printBackground: true,
          // displayHeaderFooter: true,
          // headerTemplate: '',
          // footerTemplate: '',
          margin: {
            top: "0",
            bottom: "2cm",
            left: "0",
            right: "0",
          },
        });

        await browser.close();
        console.info(`Brownser close`);

        const pdfDoc = await pdfLib.PDFDocument.create();

        // add html pdf pages to the pdf
        const pages = await pdfLib.PDFDocument.load(pdfPages);
        const copiedPages = await pdfDoc.copyPages(
          pages,
          pages.getPageIndices()
        );
        copiedPages.forEach((copiedPage) => pdfDoc.addPage(copiedPage));

        const pdfBytes = await pdfDoc.save();

        resolve(pdfBytes);
      } catch (e) {
        console.error(e);
        reject(e);
      } finally {
        if (!isOnlyServe) {
          server.close();
          console.info(`Server close`);
        }
      }
    });
  });
};
