const { query } = require("faunadb");

// Initialize FaunaDB
var faunadb = require("faunadb"),
  q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    let reqObj = JSON.parse(event.body);
    var client = new faunadb.Client({
      secret: process.env.FAUNADB_ADMIN_SECRET,
    });
    var result = await client.query(
      q.Create(q.Collection("CRUD"), {
        data: { title: reqObj },
      })
    );
    return {
      statusCode: 200,

      body: JSON.stringify({
        todoID: result.ref.id,
        todoTitle: result.data.title,
        timeStamp: result.ts,
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
