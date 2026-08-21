# Lista de Tareas — Especies Arbóreas Autóctonas de Argentina 🌳

> Tareas **atómicas**, **pequeñas** y **verificables**, ordenadas lógicamente.
> **Reglas:**
>
> - Cada tarea se completa en **una sesión corta** y no se mezcla con otras.
> - Cada tarea termina **probándose** (con `npm run start` / Expo Go o `npm run web`).
> - Numeración: `T01`, `T02`, … (orden de dependencia).

> **Prioridad de construcción:** configurar el **router** y crear los **mocks** antes de dedicarse al diseño visual complejo (tipografía + componentes + estilos).

**Checklist de definición de "terminado" por tarea:**

- [x] Código escrito y sin errores de TypeScript/compilación.
- [x] Probado (la funcionalidad se ve/ejecuta).
- [x] No rompe tareas anteriores.

---

## FASE 1 — Setup y Router

### T01 · Proyecto Expo + expo-router configurado

- Crear el proyecto Expo con TypeScript (`npx create-expo-app@latest`, template blank-typescript).
- Instalar `expo-router` y dependencias: `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`, `expo-status-bar`.
- Configurar `package.json`: `"main": "expo-router/entry"`.
- Crear `app/_layout.tsx` raíz (Stack) mínimo y `app/index.tsx` placeholder.
- ✅ **Verificar:** la app abre sin errores.

### T02 · Navegación base (tabs + stack)

- Crear `app/(tabs)/_layout.tsx` con las **4 pestañas**: Inicio, Catálogo, Favoritos, Más (barra negra).
- Crear pantallas placeholder en cada tab.
- Crear la ruta de stack `app/arbol/[id].tsx` (placeholder) con botón "Volver".
- ✅ **Verificar:** se navega entre las 4 pestañas y hacia la ruta dinámica y se vuelve.

---

## FASE 2 — Datos y persistencia

### T03 · Tipos de datos

- Crear `constants/arboles.ts` con los tipos `Arbol`, `Taxonomia` y `Lista`.
- ✅ **Verificar:** tipa correctamente (sin errores TS).

### T04 · Datos mock

- Crear `ARBOLES_15` (los 15 árboles del PDF: nombre, nombre científico, taxonomía y descripciones).
- Crear `constants/imagenes.ts`: `ARBOL_GENERICO` (placeholder) + `IMAGENES_DEFECTO` (los 4 árboles por defecto).
- ✅ **Verificar:** se importa el mock sin errores TS.

### T05 · Capa de persistencia

- Instalar `@react-native-async-storage/async-storage`.
- Crear `lib/storage.ts`: `cargarArboles`, `guardarArboles`, `cargarListas`, `guardarListas`, `nuevoId`.
- **Seeds:** sin datos guardados, sembrar los 4 árboles por defecto.
- ✅ **Verificar:** guardar/leer funciona y sobrevive al reinicio (web y mobile).

---

## FASE 3 — Diseño visual

### T06 · Tipografía y estilos base

- Crear `app/global.css`: Times New Roman global y contorno blanco (`[data-outline='true']`).
- Ajustar `components/texto.tsx` para aplicar el contorno vía `dataSet` (react-native-web no reenvía className).
- ✅ **Verificar:** las letras se ven con contorno blanco sobre cualquier fondo.

### T07 · Componentes UI reutilizables

- Crear `components/boton.tsx` (verde `#2e7d32`, redondeado, borde negro, texto blanco h3).
- Crear `components/modal.tsx` (`Caja`: Modal transparente reutilizable con botón cerrar).
- ✅ **Verificar:** botón y modal se renderizan correctamente.

---

## FASE 4 — Pantallas

### T08 · Vista 1 — Portada

- Implementar `app/(tabs)/index.tsx`: fondo **Ceibo**, título h1 con contorno, texto de presentación **justificado**, botón "Ver catálogo".
- ✅ **Verificar:** se ve el título y el botón navega al catálogo.

### T09 · Vista 2 — Catálogo

- Implementar `app/(tabs)/catalogo.tsx`: fondo **Jacarandá**, "Árboles Actuales" + "Agregar Árbol" (modal), tarjetas con nombre y descripción, botón ✕ para eliminar.
- ✅ **Verificar:** se listan los 4 árboles, se agrega/elimina uno.

### T10 · Ficha de árbol

- Implementar `app/arbol/[id].tsx`: imagen, "Subir imagen" (ImagePicker → base64), nombre, científico, taxonomía, descripción, "Agregar a favoritos" (modal).
- ✅ **Verificar:** se ve la ficha completa; una imagen subida se persiste.

### T11 · Vista 3 — Favoritos

- Implementar `app/(tabs)/favoritos.tsx`: fondo **Lapacho Rosado**, crear/eliminar listas (cajitas punteadas), tarjetas con miniatura, quitar árboles, guardar.
- ✅ **Verificar:** crear una lista, agregar un árbol desde la ficha y verlo en favoritos.

### T12 · Vista 4 — ¡Algunos Árboles más!

- Implementar `app/(tabs)/mas.tsx`: fondo **Quebracho Colorado**, mock de backend (3 s) y lista de los **15 árboles** con imagen genérica.
- ✅ **Verificar:** tras 3 s se ven los 15 árboles.

---

## FASE 5 — Responsive y correcciones web/mobile

### T13 · Responsive del encabezado del catálogo

- Evitar que "Agregar Árbol" se superponga con "Árboles Actuales" en pantallas angostas (Android).
- ✅ **Verificar:** en mobile el encabezado no se superpone.

### T14 · Fondos en web (sin parte en blanco)

- Corregir que en web los fondos queden cortados/borrosos: `Platform.select({ web: { height: "100%" } })` en los `ImageBackground` (react-native-web usa el alto natural de la imagen sin height).
- **No tocar mobile.**
- ✅ **Verificar:** en web el fondo cubre toda la pantalla; en mobile intacto.

### T15 · Texto de la portada

- Justificar el texto de la vista 1 (sin saltos `\n` forzados, que anulan `text-align: justify` en CSS) y mantener el bloque centrado.
- ✅ **Verificar:** el texto se ve justificado y centrado.

---

## FASE 6 — Integración y QA

### T16 · Persistencia cruzada

- Verificar que los cambios se reflejan entre pantallas: agregar árbol → catálogo; agregar a favoritos → lista; subir imagen → ficha.
- ✅ **Verificar:** al reabrir la app se conservan árboles, imágenes y listas.

### T17 · Estados vacíos y errores

- Revisar lista vacía (favoritos con CTA al catálogo) y árbol no encontrado (ficha con ID inválido).
- ✅ **Verificar:** los estados vacíos muestran mensajes amigables.

### T18 · Pulido final y QA

- Revisar consistencia visual (tipografía, contorno, botones), espaciados y accesibilidad (labels).
- Paseo completo: Portada → Catálogo → Ficha → Favoritos → Más.
- ✅ **Verificar:** flujo completo sin pantallas en blanco ni errores no controlados.

---

## Resumen de fases

| Fase                         | Tareas  | Objetivo                                  | Estado |
| ---------------------------- | ------- | ----------------------------------------- | ------ |
| 1. Setup y Router            | T01–T02 | Router y navegación base funcionando      | ✅     |
| 2. Datos y persistencia      | T03–T05 | Tipos, mocks y persistencia local         | ✅     |
| 3. Diseño visual             | T06–T07 | Tipografía y componentes UI               | ✅     |
| 4. Pantallas                 | T08–T12 | Portada, catálogo, ficha, favoritos y más | ✅     |
| 5. Responsive y correcciones | T13–T15 | Web/mobile sin regresiones                | ✅     |
| 6. Integración y QA          | T16–T18 | Persistencia, estados y pulido            | ✅     |

> **Estado global:** T01–T18 completadas. ✅
