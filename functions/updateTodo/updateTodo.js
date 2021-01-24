const faunadb = require("faunadb"),
  q = faunadb.query;
  const dotenv = require("dotenv");

  dotenv.config();
exports.handler = async (event, context) => {
  try {
    const client = new faunadb.Client({
      secret:process.env.FAUANAKEY,
    });

    const requestedData = JSON.parse(event.body);
    console.log(requestedData)
    const result = await client.query(
      q.Update(q.Ref(q.Collection("CRUD"), requestedData.values.id), {
        data: { title: requestedData.values.todoInput },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "To Updated successfully",
      }),
    };
  } catch (error) {
    console.log(error.message);
    // return { statusCode: 400, body: error.toString() };
  }
};
