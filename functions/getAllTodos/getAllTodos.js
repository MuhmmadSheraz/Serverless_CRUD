const { query } = require("faunadb");
const { FAUNADB_ADMIN_SECRET } = process.env;

var faunadb = require("faunadb"),
  q = faunadb.query;

exports.handler = async (event) => {
  try {
    var client = new faunadb.Client({
      secret: FAUNADB_ADMIN_SECRET,
    });
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("CRUD"))),
        q.Lambda((x) => q.Get(x))
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
