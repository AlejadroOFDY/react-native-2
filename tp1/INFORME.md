# Informe — Especies Arbóreas Autóctonas de Argentina

## 1. Introducción

Este trabajo práctico consiste en una aplicación **web sin backend** que presenta información sobre las especies arbóreas autóctonas de Argentina. El objetivo es expresar la importancia de estos árboles y reflejar el gusto por ellos, aplicando conceptos de navegación, estado, persistencia local y simulación de un backend (mock).

## 2. Tecnologías utilizadas

- **Expo SDK 54** con **React Native Web** (un solo código que corre en el navegador).
- **Expo Router** para la navegación entre vistas (rutas por archivos).
- **Expo ImagePicker** para la subida de imágenes desde el dispositivo.
- **localStorage** para la persistencia local (árboles y listas de favoritos).
- **TypeScript**.

## 3. Vistas

### Vista 1 — Portada

- Fondo: imagen del **Ceibo** (`Ceibo.jpg`).
- Título en h1 negro con contorno blanco: _«Especies Arbóreas Autóctonas de Argentina»_.
- Texto de presentación centrado.
- Botón «Ver catálogo» (verde, redondeado, letras blancas y borde negro) que lleva a la Vista 2.

### Vista 2 — Catálogo («Árboles Actuales»)

- Fondo: imagen del **Jacarandá**.
- Caja 1: título «Árboles Actuales» a la izquierda y botón «Agregar Árbol» a la derecha.
- Caja 2: lista de árboles por defecto (**ceibo, jacarandá, lapacho rosado y quebracho colorado**), cada uno con su nombre y una breve descripción. El botón «Agregar Árbol» permite incorporar nuevos árboles.
- Al tocar una tarjeta se abre la ficha propia de ese árbol.

### Ficha de árbol

- Imagen centrada (por defecto **Arbol-Genérico** como placeholder; los 4 árboles iniciales ya traen su foto).
- Botón «Subir imagen» para cargar una foto desde el dispositivo.
- Nombre oficial, nombre científico, **taxonomía** (reino, división, clase, orden, familia, género y especie) y **descripción** de características.
- Botón «Agregar a favoritos» (abajo a la derecha) relacionado con la Vista 3.

### Vista 3 — Favoritos

- Fondo: imagen del **Lapacho Rosado**.
- Caja principal que contiene cajas redondeadas con **línea de puntos** y un **«+»** dentro, una por lista, con su nombre arriba.
- Botón «crear listas»: abre una ventana para ingresar el nombre y confirmar.
- Al hacer clic en una cajita punteada se muestran los árboles guardados como **tarjetas alargadas y redondeadas**.
- Si la lista está vacía, se invita a ir a la Vista 2 para elegir un árbol y usar «Agregar a favoritos».
- Se puede **agregar más**, **eliminar** algún árbol o **guardar la lista**. Todo se persiste en el dispositivo.

### Vista 4 — «¡Algunos Árboles más!»

- Título centrado en h1 negro.
- Fondo: imagen del **Quebracho Colorado**.
- Una caja muestra _«Espera mientras nuestra backend responde...»_ y, **pasados 3 segundos** (mock), se muestran los **15 árboles** del PDF con su imagen genérica y su descripción (se ignora la taxonomía).

## 4. Persistencia local

- Los **árboles** (incluidos los agregados por el usuario y sus imágenes) se guardan en `localStorage` bajo la clave `tp1.arboles`.
- Las **listas de favoritos** se guardan bajo la clave `tp1.listas`.
- Los 4 árboles por defecto se siembran la primera vez que se abre la app.

## 5. Datos

Los datos de los 15 árboles (nombres, nombres científicos, taxonomía y descripciones) provienen de `assets/Arboles_Nativos_Argentina.pdf`. Las fotos individuales se extrajeron del PDF a la carpeta `assets/arboles/`.

## 6. Cómo ejecutar

```bash
npm install
npm run web
```

Abrir `http://localhost:8081` en el navegador.
