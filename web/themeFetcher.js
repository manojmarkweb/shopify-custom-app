import shopify from "./shopify.js";

export default async function themeFetcher(session){
    try {
        const themes = await shopify.api.rest.Theme.all({ session });
        console.log(themes); // Log the themes data
        return themes; // Return the themes data to the caller
      } catch (e) {
        // Handle errors or log them if necessary
        console.error("Failed to fetch themes:", e);
        throw e; // Optionally re-throw the error to be handled by the caller
      }
}