const fs = require("fs");

// GET /supportedEmoji
exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));

  const knownSupportedEmoji = JSON.parse(
    fs.readFileSync(`./knownSupportedEmoji.json`),
  ).knownSupportedEmoji;

  return {
    cookies: [],
    isBase64Encoded: false,
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(knownSupportedEmoji),
  };
};
