# Especies Arbóreas Autóctonas de Argentina 🌳

Aplicación **web sin backend** (mock) construida con **Expo SDK 54 + React Native Web**, sobre el tema de los árboles nativos de Argentina.

Consta de **4 vistas**:

1. **Portada** — Fondo con la imagen del ceibo, título con contorno blanco y botón «Ver catálogo».
2. **Catálogo** — «Árboles Actuales» (ceibo, jacarandá, lapacho rosado y quebracho colorado) con la posibilidad de **agregar árboles**. Cada árbol abre su propia ficha.
3. **Favoritos** — Creación de **listas** (cajas punteadas con «+») donde se guardan árboles favoritos. Todo persiste en el dispositivo.
4. **¡Algunos Árboles más!** — Mock de backend: tras 3 segundos muestra los **15 árboles** de la guía (imagen genérica + descripción).

## Características

- Tipografía **Times New Roman** en todas las vistas.
- Letras negras con **contorno blanco** para legibilidad sobre los fondos.
- Botones verdes redondeados, letras blancas y borde negro.
- Fichas de árboles con: imagen, subida de imagen, nombre científico, taxonomía y descripción.
- Persistencia con `localStorage` (árboles y listas de favoritos).

## Requisitos

- Node.js
- npm

## Ejecución

```bash
npm install
npm run web
```

Se abre en el navegador en `http://localhost:8081`.

> Los datos de los 15 árboles provienen de `assets/Arboles_Nativos_Argentina.pdf` y sus fotos se extrajeron a `assets/arboles/`. Ver `INFORME.md` para el detalle de las vistas.
