const fetchImageUrl = async (query) => {
  const accessKey = process.env.UNSPLASH_API;
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const firstResult = data.results[0];
      const imageUrl = firstResult.urls.regular; // You can choose 'regular', 'small', 'full', etc.
      console.log("First image URL:", imageUrl);
      return imageUrl;
    } else {
      console.log("No results found");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

module.exports = fetchImageUrl;
