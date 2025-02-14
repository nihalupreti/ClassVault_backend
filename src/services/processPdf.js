const fs = require("fs");
const pdfParse = require("pdf-parse");
const elasticClient = require("../config/elasticSearch");

async function processPDFToJSON({ pdfPath, pdfId }) {
  try {
    // First check if Elasticsearch is running
    const health = await elasticClient.cluster.health();
    console.log("Elasticsearch status:", health.status);

    const dataBuffer = fs.readFileSync(pdfPath);
    const pages = [];

    const options = {
      pagerender: async function (pageData) {
        const textContent = await pageData.getTextContent();
        const text = textContent.items.map((item) => item.str).join(" ");
        pages.push({
          page: pages.length + 1,
          content: text.trim(),
          pdfPath,
          pdfId,
          indexedAt: new Date().toISOString(),
        });
      },
    };

    await pdfParse(dataBuffer, options);
    console.log(`Processed ${pages.length} pages from PDF`);

    // Create index with explicit mapping if it doesn't exist
    const indexExists = await elasticClient.indices.exists({ index: "pdf" });
    if (!indexExists) {
      await elasticClient.indices.create({
        index: "pdf",
        body: {
          mappings: {
            properties: {
              page: { type: "integer" },
              content: { type: "text" },
              pdfPath: { type: "keyword" },
              indexedAt: { type: "date" },
            },
          },
        },
      });
      console.log('Created "pdf" index with mappings');
    }

    // Index documents with bulk operation
    const body = pages.flatMap((doc) => [{ index: { _index: "pdf" } }, doc]);

    const { errors, items } = await elasticClient.bulk({ refresh: true, body });

    if (errors) {
      console.error(
        "Some documents failed to index:",
        items.filter((item) => item.index.error)
      );
    }

    // Verify documents were indexed
    const count = await elasticClient.count({ index: "pdf" });
    console.log(`Total documents in index: ${count.count}`);

    return pages;
  } catch (error) {
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      meta: error.meta?.body?.error,
    });
    throw error;
  }
}

module.exports = processPDFToJSON;
