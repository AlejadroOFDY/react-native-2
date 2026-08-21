# Spec — Especies Arbóreas Autóctonas de Argentina 🌳

> **Prototipo funcional de una aplicación (web + mobile con un solo código) sobre las especies arbóreas nativas de Argentina**: catálogo, fichas con taxonomía, listas de favoritos y una vista con mock de backend.
> Metodología: **Spec-Driven Development (SDD)** — este documento es la fuente de verdad antes de escribir cualquier código.

---

## 1. Resumen del proyecto

**Especies Arbóreas Autóctonas de Argentina** es una aplicación sin backend que permite al usuario:

1. Ver una **portada** con el título del trabajo y un botón para entrar al catálogo.
2. Explorar un **catálogo de árboles** (por defecto: ceibo, jacarandá, lapacho rosado y quebracho colorado), **agregar** y **eliminar** árboles propios.
3. Consultar la **ficha de cada árbol**: imagen (con opción de **subir una propia**), nombre científico, **taxonomía** completa y descripción.
4. Armar **listas de favoritos** (crear, eliminar, agregar/quitar árboles y guardar) con **persistencia local**.
5. Ver la vista **«¡Algunos Árboles más!»** que simula un **backend** (3 segundos de espera) y lista los **15 árboles** extraídos del PDF.

El prototipo **no tiene backend real**: los datos provienen de **mocks locales** (`ARBOLES_15` extraído de `assets/Arboles_Nativos_Argentina.pdf`) y la **persistencia local** se maneja con `AsyncStorage` (misma API en web y mobile).

### Stack tecnológico (estricto)

| Capa                 | Tecnología                                              |
| -------------------- | ------------------------------------------------------- |
| Framework            | React Native                                            |
| Entorno de ejecución | Expo SDK 54                                             |
| Navegación           | `expo-router` (file-based routing)                      |
| Web                  | React Native Web (mismo código que mobile)              |
| Backend              | **Ninguno** — mock con `setTimeout` (3 s en la vista 4) |
| Persistencia         | `AsyncStorage` (claves `tp1.arboles` y `tp1.listas`)    |
| Subida de imagen     | `expo-image-picker` (data URI base64)                   |

### Objetivos del prototipo

- Validar la **navegación** entre las 4 vistas (tabs) y la ficha (stack).
- Validar la **persistencia local** de árboles, imágenes y listas de favoritos.
- Validar el **mock de backend** con estado de carga en la vista 4.
- Validar el flujo completo: Portada → Catálogo → Ficha → Favoritos.

---

## 2. Modelo de datos (mock local)

### 2.1. `Arbol`

| Campo                  | Tipo             | Descripción                                      |
| ---------------------- | ---------------- | ------------------------------------------------ |
| `id`                   | `string`         | Identificador único (ej: `"ceibo"`)              |
| `nombre`               | `string`         | Nombre común (ej: "Ceibo")                       |
| `cientifico`           | `string`         | Nombre científico (ej: "Erythrina crista-galli") |
| `descripcion`          | `string`         | Descripción breve (tarjeta del catálogo)         |
| `descripcionDetalle`   | `string`         | Descripción completa (ficha)                     |
| `taxonomia`            | `Taxonomia`      | Clasificación taxonómica completa                |
| `imagenPersonalizada?` | `string \| null` | Imagen subida por el usuario (data URI base64)   |

### 2.2. `Taxonomia`

| Campo                                                                 | Tipo     |
| --------------------------------------------------------------------- | -------- |
| `Reino`, `División`, `Clase`, `Orden`, `Familia`, `Género`, `Especie` | `string` |

### 2.3. `Lista`

| Campo     | Tipo       | Descripción                              |
| --------- | ---------- | ---------------------------------------- |
| `id`      | `string`   | Identificador único                      |
| `nombre`  | `string`   | Nombre de la lista (ej: "Mis favoritos") |
| `arboles` | `string[]` | IDs de árboles guardados en la lista     |

### 2.4. Persistencia

- Los **árboles** (incluidos los agregados por el usuario y sus imágenes) se guardan en `AsyncStorage` bajo `tp1.arboles`.
- Las **listas de favoritos** se guardan bajo `tp1.listas`.
- La primera vez (sin datos) se **siembran los 4 árboles por defecto**: ceibo, jacarandá, lapacho rosado y quebracho colorado.
- Los **15 árboles** de la vista 4 provienen del mock estático `ARBOLES_15`.

---

## 3. Pantallas requeridas

```text
app/
├── _layout.tsx            → Layout raíz (Stack)
├── (tabs)/
│   ├── _layout.tsx        → Tabs: Inicio | Catálogo | Favoritos | Más
│   ├── index.tsx          → Vista 1: Portada
│   ├── catalogo.tsx       → Vista 2: Catálogo
│   ├── favoritos.tsx      → Vista 3: Favoritos
│   └── mas.tsx            → Vista 4: ¡Algunos Árboles más!
└── arbol/
    └── [id].tsx           → Ficha de árbol (stack)
```

### Vista 1 — Portada (`(tabs)/index.tsx`)

- Fondo: **Ceibo**. Título h1 con contorno blanco: _«Especies Arbóreas Autóctonas de Argentina»_.
- Texto de presentación **justificado** en recuadro blanco redondeado.
- Botón **"Ver catálogo"** (verde, redondeado, letras blancas, borde negro) → Vista 2.

### Vista 2 — Catálogo (`(tabs)/catalogo.tsx`)

- Fondo: **Jacarandá**.
- Caja 1: título **"Árboles Actuales"** (izquierda) + botón **"Agregar Árbol"** (derecha, responsive).
- Caja 2: lista de árboles por defecto; cada tarjeta muestra **nombre** + **descripción breve** y un botón **✕** para eliminarla.
- Botón "Agregar Árbol" abre un modal (nombre + descripción) con botón para cerrar.
- Tap en una tarjeta → Ficha del árbol.

### Ficha de árbol (`arbol/[id].tsx`)

- Botón **"Volver"** arriba a la izquierda (vuelve al catálogo).
- Imagen centrada (por defecto la del árbol; **Arbol-Genérico** como placeholder).
- Botón **"Subir imagen"** (ImagePicker → data URI guardada en el árbol).
- Nombre, **nombre científico**, **taxonomía** completa y **descripción**.
- Botón **"Agregar a favoritos"** (modal: elegir una lista existente o crear una nueva).
- **No encontrado**: si el ID no existe → "Árbol no encontrado".

### Vista 3 — Favoritos (`(tabs)/favoritos.tsx`)

- Fondo: **Lapacho Rosado**.
- Botón **"Crear Listas"** (modal con nombre y botón Aceptar).
- Cada lista se muestra como **cajita punteada** con su nombre y un **«+»**.
- Al abrir una lista: tarjetas alargadas y redondeadas con **miniatura** del árbol; botones para **quitar** árboles, **"Agregar más"**, **"Guardar lista"** y **"Volver"**.
- Lista vacía → mensaje + botón que lleva al catálogo para elegir un árbol.
- Se puede **eliminar** una lista completa.

### Vista 4 — ¡Algunos Árboles más! (`(tabs)/mas.tsx`)

- Fondo: **Quebracho Colorado**. Título h1 centrado.
- Mock de backend: _"Espera mientras nuestra backend responde..."_ y, tras **3 segundos**, lista los **15 árboles** del PDF con su **imagen genérica** y **descripción** (se ignora la taxonomía).

---

## 4. Historias de usuario

> Formato: **Como** [rol], **quiero** [acción], **para** [beneficio].

### US-01 — Ver la portada

**Como** usuario, **quiero** ver el título del trabajo y un botón de acceso directo, **para** entrar al catálogo con un solo toque.

### US-02 — Explorar el catálogo

**Como** usuario, **quiero** ver la lista de árboles con su descripción breve, **para** elegir y consultar uno.

### US-03 — Agregar y eliminar árboles

**Como** usuario, **quiero** agregar un árbol propio (con nombre y descripción) y eliminar los que no me interesan, **para** personalizar el catálogo.

### US-04 — Ver la ficha de un árbol

**Como** usuario, **quiero** ver la imagen, el nombre científico, la taxonomía y la descripción de un árbol, **para** aprender sobre la especie.

### US-05 — Subir una imagen propia

**Como** usuario, **quiero** cargar una foto desde mi dispositivo para un árbol, **para** que quede registrada en su ficha.

### US-06 — Armar listas de favoritos

**Como** usuario, **quiero** crear listas, agregar/quitar árboles y guardarlas, **para** tener mis especies preferidas organizadas.

### US-07 — Ver más especies con mock de backend

**Como** usuario, **quiero** que al entrar a la vista 4 aparezca una espera simulada y luego los 15 árboles, **para** ver el comportamiento de un backend mock.

---

## 5. Criterios de aceptación

> Todas las funcionalidades con datos asíncronos o persistencia manejan estados explícitos.

### AC-01 · Portada

- [ ] Muestra el fondo del **Ceibo** y el título con contorno blanco.
- [ ] El texto de presentación está **justificado** y el bloque queda **centrado**.
- [ ] El botón "Ver catálogo" navega al catálogo.
- [ ] En la versión **web**, el fondo cubre toda la pantalla (sin parte en blanco); en **mobile** no se modifica.

### AC-02 · Catálogo

- [ ] Muestra los 4 árboles por defecto con nombre y descripción breve.
- [ ] "Agregar Árbol" abre un modal; al guardar, el árbol aparece en la lista.
- [ ] El botón ✕ elimina un árbol.
- [ ] El encabezado (título + botón) es **responsive** (no se superpone en Android).
- [ ] Tap en una tarjeta navega a la ficha.

### AC-03 · Ficha de árbol

- [ ] Muestra imagen, nombre, nombre científico, taxonomía y descripción.
- [ ] "Subir imagen" permite cargar una foto y se persiste.
- [ ] "Agregar a favoritos" permite elegir una lista o crear una nueva.
- [ ] ID inválido → "Árbol no encontrado".

### AC-04 · Favoritos

- [ ] Se pueden **crear** listas (modal) y **eliminarlas**.
- [ ] Al abrir una lista se muestran tarjetas con miniatura.
- [ ] Se puede **quitar** un árbol y **guardar** la lista.
- [ ] Lista vacía → mensaje + CTA al catálogo.
- [ ] Todo se **persiste** localmente (reabrir la app conserva los datos).

### AC-05 · Vista 4 (mock)

- [ ] Muestra _"Espera mientras nuestra backend responde..."_ durante 3 s.
- [ ] Luego lista los **15 árboles** con imagen genérica y descripción.

### AC-06 · Navegación y estados (transversal)

- [ ] Existen las **4 vistas** navegables desde el menú de pestañas (barra negra).
- [ ] La ficha es una ruta **apilada** con botón "Volver".
- [ ] Todas las letras usan **Times New Roman** con contorno blanco legible.
- [ ] La app no presenta pantallas en blanco ni errores no controlados.

---

## 6. Fuera de alcance (Out of scope)

Este prototipo **NO** incluirá:

- ❌ **Backend real** ni base de datos remota (todo mock local).
- ❌ **Autenticación** (login, usuarios, perfiles).
- ❌ **Edición de la taxonomía** de los 15 árboles (dato estático del PDF).
- ❌ **Gráficos** ni historiales de progreso.
- ❌ Integraciones con APIs externas (servicios botánicos, clima, etc.).
- ❌ **Cámara** para escanear (la subida es desde la galería, sin cámara en vivo).
- ❌ Imágenes reales de los 15 árboles (solo los 4 por defecto + placeholder genérico).
- ❌ Notificaciones, pagos, multiusuario o sincronización.
- ❌ Tests automatizados, CI/CD ni despliegue a stores.

---

## 7. Criterios de aceptación de la entrega (Definition of Done)

- [ ] La app corre con Expo (`npx expo start`) y en web (`npm run web`) sin errores de compilación.
- [ ] `expo-router` configura las rutas según la sección 3.
- [ ] US-01 a US-07 implementadas con sus criterios de aceptación.
- [ ] Persistencia local con `AsyncStorage` (árboles, imágenes y listas).
- [ ] Mock de backend con `setTimeout` (3 s) en la vista 4.
- [ ] Estados loading / error / empty cubiertos donde corresponde.
- [ ] UI consistente (Times New Roman, contorno blanco, botones verdes redondeados con borde negro) y navegación fluida.

---

_Fin del documento — aprobación de la spec requerida antes de iniciar la implementación._
