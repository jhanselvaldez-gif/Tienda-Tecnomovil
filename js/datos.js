/* datos.js: datos de la tienda y funciones compartidas por todas las páginas */
const STOCK_INICIAL = 8; // unidades de cada modelo al empezar
const CODIGO_DESCUENTO = "TECNOMOVIL10";
const CARPETA_IMG = "assets/img/";
const IMAGEN_VACIA = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><rect width="220" height="220" fill="#b7e4c7"/><text x="110" y="115" font-size="16" text-anchor="middle" fill="#1b4332">Sin imagen</text></svg>');
const GAMAS = { "baja": "Gama baja", "media": "Gama media", "media-alta": "Gama media-alta", "alta": "Gama alta" };

function crearProducto(id, marca, nombre, gama, almacenamiento, ram, so, cincoG, estado, precio, imagen, alias) {
  return { id, marca, nombre, gama, almacenamiento, ram, so, cincoG, estado, precio, imagen, alias };
}

// Datos de ejemplo. El orden (5 por marca) es el que usa la cuadrícula 5x5 del catálogo.
const PRODUCTOS = [
  crearProducto("iphone-13", "Apple", "iPhone 13", "media-alta", 128, 4, "iOS", true, "Reacondicionado", 32900, "iPhone 13.jpg", ["iphone 13"]),
  crearProducto("iphone-14-plus", "Apple", "iPhone 14 Plus", "media-alta", 128, 6, "iOS", true, "Reacondicionado", 39900, "iPhone 14 Plus.avif", ["iphone 14 plus", "iphone 14"]),
  crearProducto("iphone-15-pro-max", "Apple", "iPhone 15 Pro Max", "alta", 256, 8, "iOS", true, "Nuevo", 74900, "iPhone 15 Pro Max.jpg", ["iphone 15 pro max", "iphone 15"]),
  crearProducto("iphone-16-plus", "Apple", "iPhone 16 Plus", "alta", 256, 8, "iOS", true, "Nuevo", 69900, "iPhone 16 Plus.jpg", ["iphone 16 plus", "iphone 16"]),
  crearProducto("iphone-17-pro-max", "Apple", "iPhone 17 Pro Max", "alta", 512, 12, "iOS", true, "Nuevo", 109900, "iPhone 17 Pro Max.jpg", ["iphone 17 pro max", "iphone 17"]),

  crearProducto("samsung-s21-ultra", "Samsung", "Samsung S21 Ultra", "alta", 256, 12, "Android", true, "Reacondicionado", 38900, "Samsung S21 Ultra.jpg", ["samsung s21 ultra", "s21 ultra", "s21"]),
  crearProducto("samsung-a36", "Samsung", "Samsung A36", "media", 128, 6, "Android", true, "Nuevo", 19900, "Samsung  A36.jpg", ["samsung a36", "a36"]),
  crearProducto("samsung-z-fold-8", "Samsung", "Samsung Z Fold 8", "alta", 512, 12, "Android", true, "Nuevo", 119900, "Samsung z fold 8.jpg", ["samsung z fold 8", "z fold 8", "zfold 8", "fold 8"]),
  crearProducto("samsung-s24-ultra", "Samsung", "Samsung S24 Ultra", "alta", 256, 12, "Android", true, "Nuevo", 72900, "Samsung S24 Ultra.jpg", ["samsung s24 ultra", "s24 ultra", "s24"]),
  crearProducto("samsung-s26-ultra", "Samsung", "Samsung S26 Ultra", "alta", 512, 12, "Android", true, "Nuevo", 99900, "Samsung S26 Ultra.jpg", ["samsung s26 ultra", "s26 ultra", "s26"]),

  crearProducto("xiaomi-18-pro-max", "Xiaomi", "Xiaomi 18 Pro Max", "alta", 512, 16, "Android", true, "Nuevo", 84900, "Xiaomi 18 Pro Max.jpg", ["xiaomi 18 pro max", "18 pro max", "xiaomi 18"]),
  crearProducto("xiaomi-17t-pro", "Xiaomi", "Xiaomi 17T Pro", "media-alta", 256, 12, "Android", true, "Nuevo", 42900, "Xiaomi 17T Pro.jpg", ["xiaomi 17t pro", "17t pro", "17t"]),
  crearProducto("redmi-note-15-pro-plus-5g", "Xiaomi", "Redmi Note 15 Pro Plus 5G", "media", 256, 8, "Android", true, "Nuevo", 24900, "Redmi Note 15 Pro Plus 5G.jpg", ["redmi note 15 pro plus 5g", "redmi note 15 pro plus", "note 15 pro plus", "note 15"]),
  crearProducto("poco-f8-pro", "Xiaomi", "POCO F8 Pro", "media-alta", 256, 12, "Android", true, "Nuevo", 36900, "POCO F8 Pro.jpg", ["poco f8 pro", "poco f8", "f8 pro"]),
  crearProducto("redmi-14c", "Xiaomi", "Redmi 14C", "baja", 128, 4, "Android", false, "Nuevo", 8900, "Redmi 14C.jpg", ["redmi 14c", "14c"]),

  crearProducto("motorola-razr-ultra", "Motorola", "Motorola Razr Ultra", "alta", 512, 16, "Android", true, "Nuevo", 89900, "Motorola Razr Ultra.jpg", ["motorola razr ultra", "razr ultra", "razr"]),
  crearProducto("motorola-signature", "Motorola", "Motorola Signature", "alta", 512, 16, "Android", true, "Nuevo", 79900, "Motorola Signature.jpg", ["motorola signature", "signature"]),
  crearProducto("motorola-edge-60-pro", "Motorola", "Motorola Edge 60 Pro", "media-alta", 256, 12, "Android", true, "Nuevo", 37900, "Motorola Edge 60 Pro.webp", ["motorola edge 60 pro", "edge 60 pro", "edge 60"]),
  crearProducto("moto-g35", "Motorola", "Moto G35", "media", 128, 4, "Android", true, "Nuevo", 14900, "Moto G35.jpg", ["moto g35", "g35"]),
  crearProducto("moto-g24", "Motorola", "Moto G24", "baja", 128, 4, "Android", false, "Nuevo", 9900, "Moto G24.jpg", ["moto g24", "g24"]),

  crearProducto("honor-magic-8-pro", "Honor", "Honor Magic 8 Pro", "alta", 512, 16, "Android", true, "Nuevo", 87900, "Honor Magic 8 Pro.jpg", ["honor magic 8 pro", "magic 8 pro", "magic 8"]),
  crearProducto("honor-magic-7-pro", "Honor", "Honor Magic 7 Pro", "alta", 512, 12, "Android", true, "Reacondicionado", 64900, "Honor Magic 7 Pro.jpg", ["honor magic 7 pro", "magic 7 pro", "magic 7"]),
  crearProducto("honor-robot-phone", "Honor", "Honor Robot Phone", "alta", 512, 16, "Android", true, "Nuevo", 94900, "Honor Robot Phone.jpg", ["honor robot phone", "robot phone"]),
  crearProducto("honor-200-pro", "Honor", "Honor 200 Pro", "media-alta", 256, 12, "Android", true, "Nuevo", 34900, "Honor 200 Pro.jpg", ["honor 200 pro", "200 pro"]),
  crearProducto("honor-x8b", "Honor", "Honor X8b", "baja", 128, 8, "Android", false, "Nuevo", 10900, "Honor X8b.jpg", ["honor x8b", "x8b"])
];

/* ---------- Utilidades ---------- */
function obtenerProducto(id) { return PRODUCTOS.find(p => p.id === id) || null; }
function formatoPrecio(n) { return "RD$ " + Number(n).toLocaleString("en-US"); }
function normalizar(texto) { // minúsculas, sin tildes ni símbolos
  return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

/* ---------- Almacenamiento del navegador (con validación al leer) ---------- */
function leerAlmacen(clave, defecto) {
  try { const v = JSON.parse(localStorage.getItem(clave)); return v === null ? defecto : v; } catch (e) { return defecto; }
}
function guardarAlmacen(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento disponible */ }
}

/* ---------- Inventario ---------- */
function leerStock() {
  const guardado = leerAlmacen("tm_stock", {});
  const stock = {};
  PRODUCTOS.forEach(p => {
    const n = Number(guardado[p.id]);
    stock[p.id] = Number.isInteger(n) && n >= 0 && n <= STOCK_INICIAL ? n : STOCK_INICIAL; // valores raros se corrigen
  });
  return stock;
}
function stockDe(id) { return leerStock()[id] || 0; }
function descontarStock(id, cantidad) {
  const stock = leerStock();
  if (!(id in stock) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > stock[id]) return false;
  stock[id] -= cantidad;
  guardarAlmacen("tm_stock", stock);
  return true;
}

/* ---------- Favoritos (solo se guardan códigos de producto) ---------- */
function leerFavoritos() {
  const lista = leerAlmacen("tm_favoritos", []);
  return Array.isArray(lista) ? lista.filter(id => PRODUCTOS.some(p => p.id === id)) : [];
}
function alternarFavorito(id) {
  const lista = leerFavoritos();
  const indice = lista.indexOf(id);
  if (indice >= 0) lista.splice(indice, 1); else lista.push(id);
  guardarAlmacen("tm_favoritos", lista);
  return indice < 0; // true si quedó como favorito
}

/* ---------- Pedidos (sin datos personales) ---------- */
function leerPedidos() {
  const lista = leerAlmacen("tm_pedidos", []);
  if (!Array.isArray(lista)) return [];
  return lista.filter(p => p && /^TM-\d{4,6}$/.test(p.codigo) && obtenerProducto(p.id) &&
    Number.isInteger(p.cantidad) && p.cantidad > 0 && Number.isFinite(p.fecha));
}
function crearPedido(id, cantidad, total) {
  const pedidos = leerPedidos();
  let codigo;
  do { codigo = "TM-" + (2000 + Math.floor(Math.random() * 7999)); } while (pedidos.some(p => p.codigo === codigo));
  pedidos.push({ codigo, id, cantidad, total, fecha: Date.now() });
  guardarAlmacen("tm_pedidos", pedidos.slice(-20));
  return codigo;
}

function reiniciarTienda() { // vuelve a 8 unidades por modelo y borra los pedidos de prueba
  try { localStorage.removeItem("tm_stock"); localStorage.removeItem("tm_pedidos"); } catch (e) { /* nada */ }
}