import { sortBy } from "es-toolkit/compat";

const dl = require("download-github-repo");
const fs = require("fs-extra");

const start = async () => {
  fs.ensureDirSync("content");
  fs.ensureDirSync("content/data");
  fs.ensureDirSync("content/cards");
  fs.ensureDirSync("content/rules");

  const cards = await fetch("https://cardcdn.buriedgiant.com/cards.json");
  fs.writeJsonSync("content/data/cards.json", await cards.json());

  console.log("cloned cards data");

  const faq = await fetch("https://cardcdn.buriedgiant.com/faq.json");
  fs.writeJsonSync("content/data/faq.json", await faq.json());

  console.log("cloned faq data");

  const errata = await fetch("https://cardcdn.buriedgiant.com/errata.json");
  fs.writeJsonSync("content/data/errata.json", await errata.json());

  console.log("cloned errata data");

  console.log("cloning rules");

  const rules = await fetch("https://rules.buriedgiant.com/rules.json");
  const rulesData = await rules.json();

  Object.keys(rulesData).forEach((productId) => {
    const rules = rulesData[productId]["en-US"];
    if (!rules) return;

    const latestVersion = sortBy(
      Object.keys(rules),
      (k) => +k.replace("v", "")
    ).reverse()[0];

    if (!latestVersion) return;

    const latestRulesVersion = rules[latestVersion].rules;

    console.log("got rules for", productId);
    fs.writeJsonSync(`content/rules/${productId}.json`, latestRulesVersion);
  });

  console.log("cloned rules");

  const meta = await fetch("https://rules.buriedgiant.com/app.json");
  const metaData = await meta.json();
  const products = metaData.products as Array<Record<string, { name: string }>>;

  const productList = Object.entries(products)
    .filter((p) => rulesData[p[0]])
    .map((p) => ({ name: p[1].name, value: p[0] }));
  fs.writeJsonSync("content/data/products.json", productList);

  console.log("cloned product list");

  /*
  console.log("cloning card images and symbols...");
  dl("LederCards/cards", "content/_cards", (err) => {
    if (err) return;

    console.log("cloned card images");

    fs.copySync("content/_cards/content/card-images", "content/cards/images");
    fs.copySync("content/_cards/content/card-symbols", "content/cards/symbols");
    fs.removeSync("content/_cards");
  });
  */
};

start();
