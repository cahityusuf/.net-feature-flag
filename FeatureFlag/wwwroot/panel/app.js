/* B2B Panel UI Mock (no backend dependency) */

const CATEGORIES = [
  { id: "all", label: "Tümü", dot: true },
  { id: "euromaster-products", label: "Euromaster Ürünleri", dot: true },
  { id: "fluids", label: "Sıvılar", dot: true },
  { id: "engine-oil", label: "Madeni Yağ", dot: true },
  { id: "tire", label: "Lastik", dot: true },
  { id: "spare", label: "Yedek Parça", dot: true },
  { id: "battery", label: "Akü", dot: true }
];

const PRODUCTS = [
  {
    id: "p1",
    category: "engine-oil",
    name: "Motor Yağı 5W-30 (4L)",
    sku: "OIL-5W30-4L",
    brand: "B2B",
    stock: 24,
    popularity: 93,
    priceTry: 1290
  },
  {
    id: "p2",
    category: "engine-oil",
    name: "Motor Yağı 5W-40 (4L)",
    sku: "OIL-5W40-4L",
    brand: "B2B",
    stock: 8,
    popularity: 80,
    priceTry: 1190
  },
  {
    id: "p3",
    category: "fluids",
    name: "Antifriz -40°C (3L)",
    sku: "FLD-ANT-3L",
    brand: "B2B",
    stock: 14,
    popularity: 76,
    priceTry: 540
  },
  {
    id: "p4",
    category: "fluids",
    name: "Fren Hidroliği DOT-4 (500ml)",
    sku: "FLD-DOT4-500",
    brand: "B2B",
    stock: 5,
    popularity: 68,
    priceTry: 220
  },
  {
    id: "p5",
    category: "tire",
    name: "205/55 R16 Yaz Lastiği",
    sku: "TIR-2055516-SUM",
    brand: "B2B",
    stock: 42,
    popularity: 98,
    priceTry: 3150
  },
  {
    id: "p6",
    category: "tire",
    name: "195/65 R15 Kış Lastiği",
    sku: "TIR-1956515-WIN",
    brand: "B2B",
    stock: 11,
    popularity: 85,
    priceTry: 2890
  },
  {
    id: "p7",
    category: "spare",
    name: "Yağ Filtresi (Universal)",
    sku: "SPR-OIL-FLT",
    brand: "B2B",
    stock: 9,
    popularity: 70,
    priceTry: 190
  },
  {
    id: "p8",
    category: "spare",
    name: "Hava Filtresi (Universal)",
    sku: "SPR-AIR-FLT",
    brand: "B2B",
    stock: 3,
    popularity: 60,
    priceTry: 210
  },
  {
    id: "p9",
    category: "battery",
    name: "Akü 60Ah Start-Stop",
    sku: "BAT-60AH-SS",
    brand: "B2B",
    stock: 6,
    popularity: 87,
    priceTry: 2490
  },
  {
    id: "p10",
    category: "battery",
    name: "Akü 72Ah",
    sku: "BAT-72AH",
    brand: "B2B",
    stock: 2,
    popularity: 74,
    priceTry: 2750
  },
  {
    id: "p11",
    category: "euromaster-products",
    name: "Servis Paketi: Yağ + Filtre Seti",
    sku: "EM-PACK-OIL-FLT",
    brand: "Euromaster",
    stock: 18,
    popularity: 90,
    priceTry: 1490
  },
  {
    id: "p12",
    category: "euromaster-products",
    name: "Kontrol Paketi: 10 Nokta",
    sku: "EM-CHECK-10P",
    brand: "Euromaster",
    stock: 999,
    popularity: 65,
    priceTry: 0
  }
];

const els = {
  menu: document.getElementById("categoryMenu"),
  grid: document.getElementById("productGrid"),
  sectionTitle: document.getElementById("sectionTitle"),
  sectionSubtitle: document.getElementById("sectionSubtitle"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  btnViewAll: document.getElementById("btnViewAll")
};

let state = {
  activeCategory: "all",
  query: "",
  sort: "popularity"
};

function formatTry(amount) {
  if (amount === 0) return "Teklif";
  return `${amount.toLocaleString("tr-TR")} ₺`;
}

function stockTag(stock) {
  if (stock >= 10) return { text: `Stok: ${stock}`, className: "tag tag--ok" };
  if (stock >= 1) return { text: `Stok: ${stock}`, className: "tag" };
  return { text: "Stok yok", className: "tag tag--low" };
}

function categoryLabel(categoryId) {
  return (CATEGORIES.find((c) => c.id === categoryId)?.label ?? "Ürünler");
}

function matches(product) {
  const q = state.query.trim().toLowerCase();
  const inCategory =
    state.activeCategory === "all" ? true : product.category === state.activeCategory;
  const inQuery =
    q.length === 0
      ? true
      : `${product.name} ${product.sku} ${product.brand}`.toLowerCase().includes(q);
  return inCategory && inQuery;
}

function sortProducts(items) {
  const sorted = [...items];
  switch (state.sort) {
    case "priceAsc":
      return sorted.sort((a, b) => (a.priceTry ?? 0) - (b.priceTry ?? 0));
    case "priceDesc":
      return sorted.sort((a, b) => (b.priceTry ?? 0) - (a.priceTry ?? 0));
    case "stockDesc":
      return sorted.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
    case "popularity":
    default:
      return sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  }
}

function renderMenu() {
  const counts = PRODUCTS.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  els.menu.innerHTML = "";
  for (const c of CATEGORIES) {
    const count = c.id === "all" ? PRODUCTS.length : (counts[c.id] ?? 0);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "menu__item";
    btn.setAttribute("aria-current", c.id === state.activeCategory ? "true" : "false");
    btn.addEventListener("click", () => {
      state.activeCategory = c.id;
      updateHeader();
      renderMenu();
      renderGrid();
    });

    const label = document.createElement("span");
    label.className = "menu__label";
    const dot = document.createElement("span");
    dot.className = "menu__dot";
    dot.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = c.label;
    label.appendChild(dot);
    label.appendChild(text);

    const badge = document.createElement("span");
    badge.className = "menu__count";
    badge.textContent = String(count);

    btn.appendChild(label);
    btn.appendChild(badge);
    els.menu.appendChild(btn);
  }
}

function updateHeader() {
  const label = state.activeCategory === "all" ? "Ürünler" : categoryLabel(state.activeCategory);
  const subtitle =
    state.activeCategory === "all"
      ? "Tüm ürün grupları"
      : `Seçili grup: ${categoryLabel(state.activeCategory)}`;
  els.sectionTitle.textContent = label;
  els.sectionSubtitle.textContent = subtitle;
}

function renderGrid() {
  const filtered = PRODUCTS.filter(matches);
  const sorted = sortProducts(filtered);

  els.grid.innerHTML = "";
  if (sorted.length === 0) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "Sonuç bulunamadı. Farklı bir arama deneyin.";
    els.grid.appendChild(empty);
    return;
  }

  for (const p of sorted) {
    const card = document.createElement("article");
    card.className = "card";

    const media = document.createElement("div");
    media.className = "card__media";

    const body = document.createElement("div");
    body.className = "card__body";

    const title = document.createElement("div");
    title.className = "card__title";
    title.textContent = p.name;

    const meta = document.createElement("div");
    meta.className = "card__meta";
    const tSku = document.createElement("span");
    tSku.className = "tag";
    tSku.textContent = p.sku;
    const tBrand = document.createElement("span");
    tBrand.className = "tag";
    tBrand.textContent = p.brand;
    const tStock = document.createElement("span");
    const st = stockTag(p.stock);
    tStock.className = st.className;
    tStock.textContent = st.text;

    meta.appendChild(tSku);
    meta.appendChild(tBrand);
    meta.appendChild(tStock);

    body.appendChild(title);
    body.appendChild(meta);

    const footer = document.createElement("div");
    footer.className = "card__footer";

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = formatTry(p.priceTry);

    const actions = document.createElement("div");
    actions.className = "mini-actions";
    const btnDetail = document.createElement("button");
    btnDetail.type = "button";
    btnDetail.className = "btn btn--mini";
    btnDetail.textContent = "Detay";
    btnDetail.addEventListener("click", () => {
      alert(`${p.name}\nSKU: ${p.sku}\nGrup: ${categoryLabel(p.category)}`);
    });
    const btnAdd = document.createElement("button");
    btnAdd.type = "button";
    btnAdd.className = "btn btn--primary btn--mini";
    btnAdd.textContent = p.priceTry === 0 ? "Teklif İste" : "Sepete Ekle";
    btnAdd.addEventListener("click", () => {
      alert(`İşlem: ${btnAdd.textContent}\nÜrün: ${p.name}`);
    });
    actions.appendChild(btnDetail);
    actions.appendChild(btnAdd);

    footer.appendChild(price);
    footer.appendChild(actions);

    card.appendChild(media);
    card.appendChild(body);
    card.appendChild(footer);
    els.grid.appendChild(card);
  }
}

function wireEvents() {
  els.searchInput.addEventListener("input", (e) => {
    state.query = e.target.value ?? "";
    renderGrid();
  });

  els.sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });

  els.btnViewAll.addEventListener("click", () => {
    state.activeCategory = "all";
    state.query = "";
    els.searchInput.value = "";
    updateHeader();
    renderMenu();
    renderGrid();
  });
}

function init() {
  updateHeader();
  renderMenu();
  renderGrid();
  wireEvents();
}

init();

