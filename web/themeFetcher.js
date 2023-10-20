import shopify from "./shopify.js";

export default async function themeFetcher(session){
    try{
        const theme = await shopify.api.rest.Theme.all({session});
    }catch(e){
        
    }
}