const faunadb = require("faunadb"),
  q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_ADMIN_SECRET,
    });

    const requestedData = JSON.parse(event.body);
    const result = await client.query(
      q.Update(q.Ref(q.Collection("CRUD"), requestedData.currentId), {
        data: { title: requestedData.input },
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
