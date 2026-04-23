const connection = require("../mysql_connect");

const seedEmail = "seed@retrend.com";

const products = [
  { itemName: "Classic Oxford Shirt", section: "Men", category: "Topwear", size: "M", ccondition: "Like New", price: 1599, new_price: 1299, description: "Crisp cotton Oxford shirt for smart-casual outfits.", image: "image-1747647154366.jpeg" },
  { itemName: "Relaxed Linen Shirt", section: "Men", category: "Topwear", size: "L", ccondition: "Excellent", price: 1499, new_price: null, description: "Breathable linen blend shirt for summer days.", image: "image-1747647379924.jpeg" },
  { itemName: "Slim Fit Chinos", section: "Men", category: "Bottomwear", size: "32", ccondition: "Gently Used", price: 1399, new_price: 1099, description: "Tailored chinos with stretch comfort and clean silhouette.", image: "image-1747648979279.jpg" },
  { itemName: "Casual Denim Jeans", section: "Men", category: "Bottomwear", size: "34", ccondition: "Excellent", price: 1699, new_price: null, description: "Mid-wash denim jeans with relaxed taper fit.", image: "image-1747736314819.webp" },
  { itemName: "Navy Loafers", section: "Men", category: "Casual Shoes", size: "9", ccondition: "Like New", price: 2199, new_price: 1799, description: "Soft suede loafers for everyday smart looks.", image: "image-1747736465307.jpg" },
  { itemName: "Minimal Sneakers", section: "Men", category: "Sports Shoes", size: "8", ccondition: "Excellent", price: 2499, new_price: null, description: "Clean white sneakers with cushioned sole.", image: "image-1747736696369.jpg" },
  { itemName: "Formal Pinstripe Blazer", section: "Men", category: "Formal Wear", size: "L", ccondition: "Like New", price: 2999, new_price: 2499, description: "Structured pinstripe blazer for office and occasions.", image: "image-1747736777165.jpg" },
  { itemName: "Embroidered Kurta", section: "Men", category: "Ethnic Wear", size: "XL", ccondition: "Excellent", price: 1899, new_price: null, description: "Festive kurta with subtle thread embroidery.", image: "image-1747736947704.avif" },
  { itemName: "Polarized Sunglasses", section: "Men", category: "Sunglasses", size: "Free", ccondition: "Like New", price: 1199, new_price: 899, description: "UV-protected polarized sunglasses in matte frame.", image: "image-1747737064855.jpg" },
  { itemName: "Chronograph Watch", section: "Men", category: "Watches", size: "Free", ccondition: "Gently Used", price: 2599, new_price: null, description: "Metal strap chronograph watch with blue dial.", image: "image-1747737138635.webp" },

  { itemName: "Silk Blend Blouse", section: "Women", category: "Tops", size: "S", ccondition: "Like New", price: 1699, new_price: 1399, description: "Elegant blouse with soft drape and puff sleeves.", image: "image-1747737243335.avif" },
  { itemName: "High Waist Trousers", section: "Women", category: "Bottoms", size: "M", ccondition: "Excellent", price: 1599, new_price: null, description: "Pleated high-waist trousers with wide-leg fit.", image: "image-1747739133113.webp" },
  { itemName: "Floral Midi Dress", section: "Women", category: "Dresses", size: "M", ccondition: "Like New", price: 2299, new_price: 1899, description: "Flowy floral midi dress with flattering neckline.", image: "image-1747739274458.webp" },
  { itemName: "Summer Jumpsuit", section: "Women", category: "Jumpsuits", size: "L", ccondition: "Excellent", price: 2099, new_price: null, description: "One-piece jumpsuit with belt and side pockets.", image: "image-1747739360922.webp" },
  { itemName: "Pastel Saree", section: "Women", category: "Sarees", size: "Free", ccondition: "Like New", price: 2799, new_price: 2399, description: "Pastel georgette saree with lightweight fall.", image: "image-1747739444379.webp" },
  { itemName: "Daily Kurti", section: "Women", category: "Kurtis", size: "M", ccondition: "Excellent", price: 1199, new_price: null, description: "Straight-cut daily wear kurti in breathable rayon.", image: "image-1747739500266.webp" },
  { itemName: "Designer Handbag", section: "Women", category: "Handbags", size: "Free", ccondition: "Like New", price: 2199, new_price: 1799, description: "Structured handbag with magnetic flap closure.", image: "image-1747739544828.jpg" },
  { itemName: "Ethnic Kurta Set", section: "Women", category: "Kurta Sets", size: "L", ccondition: "Excellent", price: 2499, new_price: null, description: "Coordinated kurta and pant set for festive events.", image: "image-1747739628894.avif" },
  { itemName: "Statement Sandals", section: "Women", category: "Sandals", size: "6", ccondition: "Like New", price: 1399, new_price: 1099, description: "Comfort sandals with metallic buckle accents.", image: "image-1747739668085.jpg" },
  { itemName: "Layered Necklace Set", section: "Women", category: "Jewelery", size: "Free", ccondition: "Excellent", price: 1299, new_price: null, description: "Layered jewelry set with anti-tarnish finish.", image: "image-1747739714298.avif" },

  { itemName: "Graphic Tee Pack", section: "Kids", category: "Boys Clothing", size: "10Y", ccondition: "Like New", price: 999, new_price: 799, description: "Pack of two soft cotton graphic tees for boys.", image: "image-1747739742376.jpg" },
  { itemName: "Denim Dungaree Set", section: "Kids", category: "Girls Clothing", size: "8Y", ccondition: "Excellent", price: 1199, new_price: null, description: "Dungaree and tee set with stretch comfort fabric.", image: "image-1747739776062.webp" },
  { itemName: "Kids Runner Shoes", section: "Kids", category: "Footwear", size: "3", ccondition: "Like New", price: 1499, new_price: 1199, description: "Lightweight running shoes with padded heel support.", image: "image-1747739925792.jpg" },
  { itemName: "Mini Backpack", section: "Kids", category: "Accessories", size: "Free", ccondition: "Excellent", price: 899, new_price: null, description: "Compact backpack for school and weekend use.", image: "image-1747739982760.webp" },
  { itemName: "Boys Polo Combo", section: "Kids", category: "Boys Clothing", size: "12Y", ccondition: "Excellent", price: 1099, new_price: 899, description: "Two-tone polo combo with soft pique cotton.", image: "image-1747740032086.webp" },
  { itemName: "Girls Party Dress", section: "Kids", category: "Girls Clothing", size: "9Y", ccondition: "Like New", price: 1399, new_price: null, description: "Party dress with layered tulle and satin ribbon.", image: "image-1747740271362.webp" },

  { itemName: "Textured Hoodie", section: "Men", category: "Topwear", size: "XL", ccondition: "Excellent", price: 1899, new_price: null, description: "Textured fleece hoodie for winter layering.", image: "image-1747976416910.avif" },
  { itemName: "Weekend Shorts", section: "Men", category: "Bottomwear", size: "M", ccondition: "Like New", price: 1099, new_price: 899, description: "Relaxed fit cotton shorts for everyday comfort.", image: "image-1747979093196.avif" },
  { itemName: "Vintage Windcheater", section: "Men", category: "Accessories", size: "L", ccondition: "Gently Used", price: 2099, new_price: null, description: "Retro color-block windcheater in lightweight shell.", image: "image-1748323911087.webp" },

  { itemName: "Classic Crop Top", section: "Women", category: "Tops", size: "S", ccondition: "Excellent", price: 999, new_price: 799, description: "Ribbed crop top with square neckline.", image: "image-1748323963797.webp" },
  { itemName: "Wide Leg Denims", section: "Women", category: "Bottoms", size: "M", ccondition: "Like New", price: 1799, new_price: null, description: "High-rise wide-leg denims with faded wash.", image: "image-1748324089335.jpg" },
  { itemName: "Printed Kurta", section: "Women", category: "Ethnic Wear", size: "L", ccondition: "Excellent", price: 1499, new_price: 1199, description: "Printed ethnic kurta with contrast piping.", image: "image-1748324747823.jpg" },

  { itemName: "Kids Slip-on Sandals", section: "Kids", category: "Footwear", size: "2", ccondition: "Like New", price: 899, new_price: null, description: "Easy slip-on sandals with anti-skid sole.", image: "image-1750356211979.avif" },
  { itemName: "Adventure Tee", section: "Kids", category: "Boys Clothing", size: "11Y", ccondition: "Excellent", price: 849, new_price: 699, description: "Adventure print t-shirt for active kids.", image: "image-1750612824562.jpg" },
  { itemName: "Glitter Hair Set", section: "Kids", category: "Accessories", size: "Free", ccondition: "Like New", price: 499, new_price: null, description: "Colorful hair accessory set for girls.", image: "image-1751003960905.webp" }
];

function runQuery(sql, values = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function main() {
  try {
    console.log("Resetting products in clothes table...");

    await runQuery("DELETE FROM cart");
    await runQuery("DELETE FROM clothes");
    await runQuery("ALTER TABLE clothes AUTO_INCREMENT = 1");

    const insertSql = `
      INSERT INTO clothes
      (itemName, section, category, size, ccondition, price, new_price, description, image, email, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const product of products) {
      await runQuery(insertSql, [
        product.itemName,
        product.section,
        product.category,
        product.size,
        product.ccondition,
        product.price,
        product.new_price,
        product.description,
        product.image,
        seedEmail,
        "approved",
      ]);
    }

    const summary = await runQuery(
      "SELECT section, COUNT(*) AS count FROM clothes GROUP BY section ORDER BY section"
    );

    console.log(`Inserted ${products.length} clean products.`);
    summary.forEach((row) => {
      console.log(`${row.section}: ${row.count}`);
    });

    const discounted = await runQuery(
      "SELECT COUNT(*) AS count FROM clothes WHERE new_price IS NOT NULL AND new_price < price"
    );
    console.log(`Discounted products: ${discounted[0].count}`);
  } catch (error) {
    console.error("Product reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    connection.end();
  }
}

main();

