const neo4j = require("neo4j-driver");

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USER;
const password = process.env.COGNODB_PASSWORD;

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

async function verifyConnection() {
  const session = driver.session();

  try {
    const result = await session.run(`
      RETURN "CognoDB connection successful!" AS message
    `);

    console.log(result.records[0].get("message"));
  } catch (error) {
    console.error("CognoDB connection failed:");
    console.error(error.message);
  } finally {
    await session.close();
  }
}

module.exports = {
  driver,
  verifyConnection,
};