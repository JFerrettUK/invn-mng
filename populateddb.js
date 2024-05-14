#! /usr/bin/env node

console.log(
  "Populating assistive listening product database (Contacta Systems Ltd)..."
);

const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

const Product = require("./models/product");
const Category = require("./models/category");

const categories = [];
const products = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
  await createCategories();
  await createProducts();

  // Display the created products
  console.log("\nCreated Products:");
  for (const product of products) {
    console.log(product.name, "-", product.category.name); // Access category name
  }

  console.log("Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({
    name,
    description,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function productCreate(
  name,
  pCode,
  category,
  description,
  price,
  url,
  imageURL
) {
  if (!category) {
    throw new Error(`Product '${name}' is missing a required category.`);
  }

  const product = new Product({
    name,
    pCode,
    category,
    description,
    price,
    url,
    image: imageURL,
  });
  await product.save();
  products.push(product); // Add product to the array after successful save
  console.log(`Added product: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "1-to-1",
      "Devices for direct communication between two people."
    ),
    categoryCreate(
      1,
      "LAL",
      "Large Area Listening systems for groups and public spaces."
    ),
  ]);
}

async function createProducts() {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      "QM300 Window Intercom",
      "QM300",
      categories[0],
      "High-quality window intercom for clear communication through glass.",
      599.99,
      "qm300",
      "testimageurl"
    ),
    productCreate(
      "RX10-W Receiver",
      "RX10W",
      categories[1],
      "Wireless receiver for hearing loops.",
      129.99,
      "rx10-w",
      "testimageurl"
    ),
    productCreate(
      "HS5000 Loop Amplifier",
      "HS5000",
      categories[1],
      "High-performance hearing loop driver.",
      999.99,
      "hs5000",
      "testimageurl"
    ),
    productCreate(
      "Contacta STS-K2",
      "STSK2",
      categories[1],
      "Portable induction loop kit for small meetings.",
      399.99,
      "contacta-sts-k2",
      "testimageurl"
    ),
    productCreate(
      "T-LOOP Neckloop",
      "TLP",
      categories[1],
      "Lightweight neckloop for hearing aid users.",
      79.99,
      "t-loop-neckloop",
      "testimageurl"
    ),
    productCreate(
      "Mini Mic",
      "MM2",
      categories[0],
      "Countertop intercom microphone.",
      149.99,
      "mini-mic",
      "testimageurl"
    ),
    productCreate(
      "Midi Mic",
      "MD3",
      categories[0],
      "Robust countertop intercom microphone.",
      199.99,
      "midi-mic",
      "testimageurl"
    ),
    productCreate(
      "STENTOFON IC-Edge",
      "ICE",
      categories[0],
      "Advanced window intercom system.",
      899.99,
      "stentofon-ic-edge",
      "testimageurl"
    ),
    productCreate(
      "Contacta STS-20",
      "STS20",
      categories[1],
      "Portable induction loop system.",
      1299.99,
      "contacta-sts-20",
      "testimageurl"
    ),
    productCreate(
      "HALO",
      "HALO",
      categories[0],
      "High-performance intercom microphone.",
      249.99,
      "halo",
      "testimageurl"
    ),
  ]);
}
