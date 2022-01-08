const watcher = require("@parcel/watcher");
const image = require("get-image-data");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const path = require("path");

const outputDir = path.resolve(__dirname, "../output");
const outputFile = path.resolve(outputDir, "qr.png");

const size = 400;
const inputString = "I am a pony!";

QRCode.toFile(
  outputFile,
  inputString,
  {
    type: "png",
    errorCorrectionLevel: "H",
    width: size,
    // color: {
    //   dark: "#fff",
    //   light: "#000",
    // },
  },
  function (err, url) {
    console.log(url);
  }
);

watcher.subscribe(outputDir, (err, events) => {
  const [event] = events;

  if (event.type === "update") {
    console.log("comparaison ...");

    image(event.path, function (err, info) {
      const code = jsQR(info.data, info.width, info.height);

      if (code) {
        console.log("Found:", code.data);
      } else {
        console.log("Broken!");
      }
    });
  }
});
