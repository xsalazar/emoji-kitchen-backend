const fs = require("fs");

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));

  if (!event.queryStringParameters || !event.queryStringParameters.l) {
    return;
  }

  const l = event.queryStringParameters.l;

  const knownSupportedEmoji = JSON.parse(
    fs.readFileSync(`./knownSupportedEmoji.json`),
  ).knownSupportedEmoji;

  if (knownSupportedEmoji.includes(l)) {
    const metadata = JSON.parse(fs.readFileSync(`./data/${l}.json`));

    return {
      cookies: [],
      isBase64Encoded: false,
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(metadata),
    };
  }
};
