const search = async (q) => {
  try {
    const r = await fetch('https://unsplash.com/s/photos/'+q);
    const t = await r.text();
    const m = t.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/);
    return m ? m[0] + '?auto=format&fit=crop&w=800&q=80' : null;
  } catch (e) {
    return null;
  }
};
(async () => {
    for(const q of ['ginger-root','turmeric','rosemary-herb','gooseberry','beetroot']) {
        const u = await search(q);
        console.log(q, u);
    }
})();