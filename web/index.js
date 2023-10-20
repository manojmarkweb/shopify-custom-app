// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import fs from "fs";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import pageCreater from "./page-creator.js";
import themeFetcher from './themeFetcher.js';
// import pageResponse from "./page-creator.js";


const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/themes", async(_req, res)=>{
  let status = 200;
  let error = null;

  try{
    await themeFetcher(res.locals.shopify.session);
  }catch(e){
    console.log("Failed to Fetch Theme");
  }
})


app.post("/api/pages", async(_req, res) =>{
  let status = 200;
  let error  = null;

  try{
    const formData = _req.body;
    const title = formData.title;
    const author = formData.author;
    const handle = formData.handle;
    const template = formData.template;
    const metafield = formData.metafield;
    const metatitle = formData.metatitle;
    const metadescription = formData.metadescription;
    await pageCreater(res.locals.shopify.session, title, handle, author, template, metafield, metatitle, metadescription);
  }catch(e){
    console.log("failed to create page");
    status = 500;
    error = e.message;
  }
  res.status(status).send({success: status === 200, error });
});


app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
