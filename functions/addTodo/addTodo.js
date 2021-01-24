const { query } = require("faunadb");

// Initialize FaunaDB
var faunadb = require("faunadb"),
  q = faunadb.query;

  const dotenv = require("dotenv");

  dotenv.config();
exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    console.log("process.env.FAUANAKEY===========>",process.env.FAUANAKEY,)
    let reqObj = JSON.parse(event.body);
    var client = new faunadb.Client({
      secret:process.env.FAUANAKEY,
    });
    var result = await client.query(
      q.Create(q.Collection("CRUD"), {
        data: { title: reqObj },
      })
    );
    return {
      statusCode: 200,

      body: JSON.stringify(result),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
