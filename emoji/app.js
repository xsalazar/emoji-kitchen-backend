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
    var metadata = JSON.parse(fs.readFileSync(`./data/${l}.json`));

    // Check if we're getting a specific combo
    if (event.queryStringParameters.r) {
      const r = event.queryStringParameters.r;

      // The r emoji needs to actually be supported
      const supportedEmojiCombinations = Object.keys(metadata.combinations[r]);
      if (supportedEmojiCombinations.includes(r)) {
        metadata = metadata.combinations[r].filter((c) => c.isLatest)[0];
      }
    }

    return {
      cookies: [],
      isBase64Encoded: false,
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(metadata),
    };
  }
};
