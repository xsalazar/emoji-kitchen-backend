const fs = require("fs");

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

    console.log(JSON.stringify({
      "query": query.trim()
    }));

    const metadata = JSON.parse(fs.readFileSync(`./keywords.json`));

    const emojis = Object.values(metadata.data);
    const results = emojis
      .filter(
        (e) =>
          e.alt.includes(query) || // If alt contains the query
          e.emoji.includes(query) || // Is emoji
          e.keywords.some((keyword) => keyword.includes(query)), // Any keywords contains query
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
};
