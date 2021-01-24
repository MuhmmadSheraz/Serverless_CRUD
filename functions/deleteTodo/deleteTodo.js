const faunadb = require("faunadb"),
  q = faunadb.query;
  const dotenv = require("dotenv");

  dotenv.config();
exports.handler = async (event, context) => {
  try {
    const client = new faunadb.Client({
      secret:process.env.FAUANAKEY,
    });

    const reqId = JSON.parse(event.body);

    const result = await client.query(
      q.Delete(q.Ref(q.Collection("CRUD"), reqId))
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Todo deleted successfully",
      }),
    };
  } catch (error) {
    return { statusCode: 400, body: error.toString() };
  }
};
