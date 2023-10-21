import shopify from "./shopify.js";

export default async function themeAssetFetcher(session, theme_id){
    try {
        const themeassets = await shopify.api.rest.Asset.all({
          session : session,
          theme_id: theme_id,
        });
        console.log(themeassets); // Log the themes data
        return themeassets; // Return the themes data to the caller
      } catch (e) {
        // Handle errors or log them if necessary
        console.error("Failed to fetch themes:", e);
        throw e; // Optionally re-throw the error to be handled by the caller
      }
}