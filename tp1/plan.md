# Plan Técnico — Especies Arbóreas Autóctonas de Argentina 🌳

> Plan de implementación del prototipo definido en `spec.md` (catálogo de árboles nativos, fichas con taxonomía, listas de favoritos y mock de backend).
> Stack: **React Native + Expo SDK 54 + expo-router + TypeScript**, datos mock locales con persistencia en `AsyncStorage`, sin backend.

---

## 1. Estructura de carpetas

```text
tp1/                              # Raíz del proyecto Expo
├── app/                          # 📁 expo-router (file-based routing)
│   ├── _layout.tsx               #   Layout raíz (Stack, sin header)
│   ├── global.css                #   Tipografía Times New Roman + contorno blanco (web)
│   ├── (tabs)/
│   │   ├── _layout.tsx           #   Tabs inferiores (barra negra): Inicio | Catálogo | Favoritos | Más
│   │   ├── index.tsx             #   Vista 1: Portada
│   │   ├── catalogo.tsx          #   Vista 2: Catálogo
│   │   ├── favoritos.tsx         #   Vista 3: Favoritos
│   │   └── mas.tsx               #   Vista 4: ¡Algunos Árboles más!
│   └── arbol/
│       └── [id].tsx              #   Ficha de árbol + subida de imagen + favoritos (stack)
│
├── components/                   # 📁 Componentes reutilizables (presentacionales)
│   ├── boton.tsx                 #   Botón único (verde, redondeado, borde negro, h3 blanco)
│   ├── modal.tsx                 #   Caja / ventana emergente reutilizable (agregar, listas, favoritos)
│   └── texto.tsx                 #   Texto Times New Roman con contorno blanco (outline)
│
├── constants/                    # 📁 Datos y tipos (lógica pura, sin UI)
│   ├── arboles.ts                #   Tipos (Arbol, Taxonomia, Lista) + ARBOLES_15 (mock del PDF)
│   └── imagenes.ts               #   ARBOL_GENERICO (placeholder) + IMAGENES_DEFECTO (4 árboles)
│
├── lib/                          # 📁 Capa de persistencia
│   └── storage.ts                #   cargar/guardar árboles y listas sobre AsyncStorage + seeds
│
├── assets/                       # 📁 Imágenes de fondo, PDF, arboles/ (15 png), pdf_img/
├── app.json                      # Configuración de Expo
├── package.json
└── tsconfig.json
```

### Convenciones

- **`app/`** contiene **solo** pantallas y layouts (no lógica reutilizable).
- **`components/`** son componentes **presentacionales** (reciben `props`, no tocan la persistencia).
- **`lib/storage.ts`** es el **único** lugar que accede a `AsyncStorage`.
- **`constants/`** guarda tipos y datos mock (sin imports de UI).
- Nombres de archivos en `camelCase` (boton.tsx, modal.tsx, texto.tsx); pantallas por carpeta según expo-router.
- TypeScript estricto; export default en pantallas y componentes.

---

## 2. Capa de datos y persistencia

La persistencia vive en `lib/storage.ts` sobre **`AsyncStorage`** (la misma API en web y mobile):

| Función          | Firma                               | Descripción                                                            |
| ---------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `cargarArboles`  | `(): Promise<Arbol[]>`              | Lee `tp1.arboles`; sin datos devuelve los 4 árboles por defecto (seed) |
| `guardarArboles` | `(arboles: Arbol[]): Promise<void>` | Persiste la lista de árboles                                           |
| `cargarListas`   | `(): Promise<Lista[]>`              | Lee `tp1.listas`                                                       |
| `guardarListas`  | `(listas: Lista[]): Promise<void>`  | Persiste las listas de favoritos                                       |
| `nuevoId`        | `(): string`                        | Genera IDs únicos (timestamp + random)                                 |

- **Seeds:** la primera vez (sin datos guardados) se siembran los 4 árboles por defecto (ceibo, jacarandá, lapacho rosado y quebracho colorado) desde `ARBOLES_15`.
- **Imagen subida:** el usuario carga una foto con `expo-image-picker` y se guarda como `data:image/jpeg;base64,...` en el campo `imagenPersonalizada` del árbol.

---

## 3. Navegación y estados

- **Router:** `expo-router` con `(tabs)` para las 4 vistas y `arbol/[id]` en el **stack raíz** (la ficha se apila sobre las pestañas con botón "Volver").
- **Barra de pestañas:** negra, con iconos Ionicons (`home`, `leaf`, `heart`, `ellipsis-horizontal`) y `headerShown: false`.
- **Mock de backend (Vista 4):** `setTimeout` de 3 s en `mas.tsx` que cambia de "cargando" a la lista de los 15 árboles.
- **Responsive web/mobile:** `Platform.select({ web: { height: "100%" } })` en los fondos `ImageBackground` para que en web la imagen llene la pantalla (corrige un bug de react-native-web con el alto natural de la imagen) sin tocar mobile.

---

## 4. Flujo de datos por pantalla

```mermaid
flowchart LR
    A[Portada index] -->|Boton Ver catálogo| C
    C[Catálogo catalogo] -->|cargarArboles / guardarArboles| S[(AsyncStorage)]
    C -->|router.push /arbol/id| D[Ficha arbol/[id]]
    D -->|cargarArboles + cargarListas / guardar*| S
    D -->|ImagePicker base64| D
    F[Favoritos favoritos] -->|cargarListas / cargarArboles / guardarListas| S
    M[Más mas] -->|ARBOLES_15 + setTimeout 3s| M
```

- **Pantallas** → usan `lib/storage.ts` (o el mock estático) → `useState` local → render con estados loading / empty.
- **Formularios** (agregar árbol, crear lista, subir imagen) → validación mínima inline → guardado → feedback → limpieza.

---

## 5. Decisiones técnicas clave

| Tema                | Decisión                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Rutas               | `expo-router`: `(tabs)` para las 4 vistas + `arbol/[id]` en el stack raíz                           |
| Persistencia        | `AsyncStorage` (claves `tp1.arboles` / `tp1.listas`); seeds de 4 árboles                            |
| Backend mock        | `setTimeout(3000)` en `mas.tsx` (vista 4)                                                           |
| Tipografía          | Times New Roman global (`global.css`) + contorno blanco vía `dataSet` → CSS `[data-outline='true']` |
| Fondo web           | `Platform.select({ web: { height: "100%" } })` en `ImageBackground` (bug react-native-web)          |
| Imágenes            | `require()` de assets locales; subida de imagen → data URI base64                                   |
| Botones             | Un solo componente `Boton` (verde `#2e7d32`, redondeado, borde negro, texto blanco)                 |
| Modales             | Un solo componente `Caja` (Modal transparente reutilizable)                                         |
| Listas de favoritos | Almacenan IDs de árboles; thumbnails desde `IMAGENES_DEFECTO` o `ARBOL_GENERICO`                    |

---

## 6. Orden de construcción

> **Prioridad:** configurar el router y los datos mock **antes** del diseño visual complejo.

1. Setup del proyecto + **router** (T01–T02).
2. **Datos**: tipos + mocks (T03–T04).
3. **Persistencia** con AsyncStorage (T05).
4. **Diseño visual**: tipografía + componentes UI (T06–T07).
5. **Pantallas**: Portada → Catálogo → Ficha → Favoritos → Más (T08–T12).
6. **Responsive y correcciones** web/mobile (T13–T15).
7. **Integración** final + QA (T16–T18).

> El detalle atómico y verificable está en `tasks.md`.
