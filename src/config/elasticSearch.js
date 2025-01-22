const { Client } = require("@elastic/elasticsearch");
const path = require("path");
const fs = require("fs");

const caPath = path.resolve(__dirname, "../../http_ca.crt");
console.log(caPath);
const elasticClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: process.env.ES_PASS,
  },
  tls: {
    ca: fs.readFileSync(caPath),
    rejectUnauthorized: false,
  },
  requestTimeout: 5000,
});

module.exports = elasticClient;
