async function runTest() {
  try {
    const res = await fetch('http://localhost:4200/api/products.php', {
      headers: { 'Accept': 'application/json' }
    });
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('Raw text excerpt:', text.substring(0, 100));
    const json = JSON.parse(text);
    console.log('JSON parsed successfully!');
    console.log('Is Array?', Array.isArray(json.data));
  } catch (err) {
    console.error('Error:', err.message);
  }
}
runTest();
