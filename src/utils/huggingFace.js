async function courseDescription(course) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/gemma-2-2b-it",
    {
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: `What is taught in ${course} in engineering course? Just provide me a concise statement without any polite texts.`,
        return_full_text: false,
      }),
    }
  );

  const result = await response.json();
  console.log(result);
  return (
    result.generated_text ||
    result[0].generated_text ||
    "No response generated."
  );
}

// console.log(courseDescription("calculas 1"));

module.exports = courseDescription;
