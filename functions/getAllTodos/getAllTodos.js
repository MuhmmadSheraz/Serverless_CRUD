const { query } = require("faunadb");

var faunadb = require("faunadb"),
  q = faunadb.query;

const dotenv = require("dotenv");

dotenv.config();

exports.handler = async (event) => {
    try {
      console.log("Hello Wodrld");
      var client = new faunadb.Client({
        secret:process.env.FAUANAKEY,
      });
      const result = await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("CRUD"))),
          q.Lambda((x) => q.Get(x))
        )
      );
      console.log("result",result)
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error) {
      return { statusCode: 500, body: error.toString() };
    }
};
