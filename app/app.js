const fs = require("fs");
const zlib = require("zlib");

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));

  // Handle search queries
  if (
    event.queryStringParameters &&
    event.queryStringParameters.q &&
    event.requestContext.http.method === "GET"
  ) {
    const query = event.queryStringParameters.q;

    // Some sanity checks
    if (!query || query.trim() === 0 || query.length > 128) {
      return;
    }

    const metadata = JSON.parse(fs.readFileSync(`./keywords.json`));

    const emojis = Object.values(metadata.data);
    const results = emojis
      .filter(
        (e) =>
          e.alt.includes(query) || // If alt contains the query
          e.emoji.includes(query) || // Is emoji
          e.keywords.some((keyword) => keyword.includes(query)) // Any keywords contains query
      )
      .map((r) => r.emojiCodepoint);

    return {
      cookies: [],
      isBase64Encoded: false,
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(results),
    };
  }

  if (event.requestContext.http.method === "GET") {
    const metadata = fs.readFileSync(`./metadata.json`);

    try {
      return {
        cookies: [],
        isBase64Encoded: true,
        statusCode: 200,
        headers: {
          "content-type": "application/json",
          "content-encoding": "gzip",
        },
        body: zlib.gzipSync(metadata).toString("base64"),
      };
    } catch (e) {
      console.log(JSON.stringify(e, ["name", "message", "stack"]));

      return {
        cookies: [],
        isBase64Encoded: false,
        statusCode: 500,
        headers: {},
        body: "",
      };
    }
  }
};
