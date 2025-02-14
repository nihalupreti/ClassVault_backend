function highlightExcerpt(text, query, contextLength = 50) {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const queryPosition = lowerText.indexOf(lowerQuery);

  if (queryPosition === -1) {
    return "";
  }

  // Calculate start and end positions for the excerpt
  const start = Math.max(0, queryPosition - contextLength);
  const end = Math.min(
    text.length,
    queryPosition + lowerQuery.length + contextLength
  );

  // Extract the substring and add ellipses if necessary
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";
  const excerpt = text.substring(start, end);

  return `${prefix}${excerpt}${suffix}`;
}

module.exports = highlightExcerpt;
