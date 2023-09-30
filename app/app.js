const AWS = require("aws-sdk");
const fs = require("fs");
const zlib = require("zlib");

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));
  const bucketName = "xsalazar-emoji-kitchen-data";

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
