const AWS = require("aws-sdk");
const axios = require("axios");
const fs = require("fs");
const zlib = require("zlib");

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));
  const bucketName = "xsalazar-emoji-kitchen-data";

  // Handle search queries
  if (
    event.queryStringParameters &&
    event.queryStringParameters.q &&
    event.requestContext.http.method === "GET"
  ) {
    const query = event.queryStringParameters.q;

    // Some sanity checks
    if (!query || query.trim() === 0) {
      return;
    }

    const metadata = fs.readFileSync(`./metadata.json`);

    const results = metadata.data.filter(
      (e) =>
        e.alt.contains(query) || // If alt contains the query
        e.emoji.contains(query) || // Is emoji
        e.keywords.some((keyword) => keyword.contains(query)) // Any keywords contains query
    );

    return {
      cookies: [],
      isBase64Encoded: true,
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(results),
    };
  }

  if (event.requestContext.http.method === "GET") {
    const s3 = new AWS.S3();

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
