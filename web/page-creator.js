import shopify from "./shopify.js";


export default async function pageCreater(session, title, handle, author, template, metafield, metatitle, metadescription){
try{
const page = new shopify.api.rest.Page({session});
page.id = "",
page.title = title;
page.handle=handle;
page.author = author;
page.body_html = "";
page.template_suffix=template;
page.metafields = [
  {
    namespace: "custom",
    key: "city_name",
    value: metafield,
    type: "multi_line_text_field"
  },
  {
    namespace: "global",
    key: "title_tag",
    value: metatitle,
    type: "single_line_text_field"
  },
  {
    namespace: "global",
    key: "description_tag",
    value: metadescription,
    type: "string"
  }
];


await page.save({
  update: true,
});

    }catch(err){
        console.log(err);
    }
}