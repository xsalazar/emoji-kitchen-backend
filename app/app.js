const AWS = require("aws-sdk");
const fs = require("fs");
const zlib = require("zlib");

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));
  const bucketName = "xsalazar-emoji-kitchen-data";

  // Handle bulk download requests
  if (
    event.queryStringParameters &&
    event.queryStringParameters.imageSource &&
    event.queryStringParameters.imageSource.startsWith(
      "https://www.gstatic.com/android/keyboard/emojikitchen"
    ) &&
    event.requestContext.http.method === "GET"
  ) {
    // Get image from internet
    var response = await axios.get(imageSource, {
      responseType: "arraybuffer",
    });

    return {
      cookies: [],
      isBase64Encoded: true,
      statusCode: 200,
      headers: { "content-type": "application/octet-stream" },
      body: Buffer.from(response.data, "binary").toString("base64"),
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
