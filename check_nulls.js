async function run() {
  const rs = await fetch('http://localhost:4200/api/products.php');
  const json = await rs.json();
  const prods = json.data;
  let hasNull = false;
  for (let p of prods) {
    if (p.price === null || p.price === undefined) { console.log('Null price id:', p.id); hasNull = true; }
    if (p.stock === null || p.stock === undefined) { console.log('Null stock id:', p.id); hasNull = true; }
    if (p.name === null || p.name === undefined) { console.log('Null name id:', p.id); hasNull = true; }
    if (p.image === null || p.image === undefined) { console.log('Null image id:', p.id); hasNull = true; }
  }
  if (!hasNull) console.log("NO NULLS FOUND in price, stock, name, or image.");
}
run();
