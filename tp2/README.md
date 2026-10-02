# Comedor IPF — TP2 (Expo Router, SDK 57)

Aplicación móvil del **comedor del Instituto Politécnico Formosa**. Los alumnos piden comida
desde el celular y la cocina atiende los pedidos **por orden de llegada**. El sistema combina dos
estructuras de datos propias:

- una **Cola** para los pedidos (FIFO: nadie se cuela),
- una **Pila** para el carrito (deshacer la última acción) y para el historial de atendidos.

Desarrollado con **Expo Router (SDK 57) + TypeScript**, siguiendo las consignas del Trabajo Práctico
N° 2 (Taller Complementario — React Native II).

---

## Cómo correr

```bash
npm install          # dependencias
npx expo start       # servidor de desarrollo (Elegir 'a' Android, 'w' web, etc.)
npx expo start --android
npx expo start --web
```

Verificación estática:

```bash
npx tsc --noEmit     # typecheck
npx expo lint        # lint
```

> Las dependencias nativas se instalan ** siempre** con `npx expo install <paquete>` para que la
> versión sea compatible con el SDK / Expo Go.

### Credenciales de la cocina

La sección Cocina está protegida. Usuario y clave fijos en el código (demo):

| Usuario | Clave |
|---------|-------|
| `cocina` | `cocina123` |

---

## Árbol de rutas (`src/app`)

```
src/app/
├─ _layout.tsx                 Stack raíz
├─ +not-found.tsx              404 (muestra la URL inexistente)
├─ buscar.tsx                  /buscar          (q y categoria en la URL)
├─ confirmar.tsx               /confirmar       (modal)
├─ login.tsx                   /login           (modal, solo existe sin sesión)
├─ pedido.tsx                  /pedido          (Redirect -> /carrito)
├─ (tabs)/
│  ├─ _layout.tsx              Tabs (expo-router/js-tabs)
│  ├─ index.tsx                /                (Inicio)
│  ├─ menu/
│  │  ├─ _layout.tsx           Stack de la tab Menú
│  │  ├─ index.tsx             /menu
│  │  └─ [id].tsx              /menu/[id]
│  ├─ carrito/
│  │  ├─ _layout.tsx           Stack de la tab Carrito
│  │  ├─ index.tsx             /carrito
│  │  └─ nota.tsx              /carrito/nota (formSheet)
│  └─ cocina/
│     ├─ _layout.tsx           Drawer de la tab protegida (solo con sesión)
│     ├─ index.tsx             /cocina
│     └─ atendidos.tsx         /cocina/atendidos
├─ categorias/
│  └─ [categoria].tsx          /categorias/[categoria]
├─ turno/
│  └─ [numero].tsx             /turno/[numero]
└─ ayuda/
   ├─ index.tsx                /ayuda
   └─ [...slug].tsx            /ayuda/...       (catch-all)
```

### Navegador de cada `_layout`

| Layout | Navegador | Contenido |
|--------|-----------|-----------|
| `src/app/_layout.tsx` | **Stack** raíz (ancla `(tabs)`) | `(tabs)`, `confirmar` (modal) y `login` *(protegida con `Stack.Protected`: solo sin sesión)*. También monta `GestureHandlerRootView`, el `ThemeProvider` y el `AppProvider`. |
| `src/app/(tabs)/_layout.tsx` | **Tabs** (`expo-router/js-tabs`) | Pestañas **Inicio**, **Menú** y **Carrito** (con *badge* de cantidad de ítems); **Cocina** dentro de `Tabs.Protected guard={conSesion}`. |
| `src/app/(tabs)/menu/_layout.tsx` | **Stack** | Lista (`/menu`) + detalle (`/menu/[id]`); el `headerTitle` usa `ContadorPila`. |
| `src/app/(tabs)/carrito/_layout.tsx` | **Stack** | Carrito (`/carrito`) + nota (`/carrito/nota`, `presentation: 'formSheet'`). |
| `src/app/(tabs)/cocina/_layout.tsx` | **Drawer** (`expo-router/drawer`) | Cocina (`/cocina`) + Atendidos (`/cocina/atendidos`), dentro de la tab protegida. |

---

## Organización del código

```
src/
├─ app/            solo rutas (cada archivo, una pantalla; cada _layout, un navegador)
├─ components/     Boton, ContadorPila, DondeEstoy, Pantalla, ThemedText, ThemedView
├─ constants/      theme (colores, espaciados)
├─ context/        AppContext (sesión, carrito, cola y pilas)
├─ data/           platos.ts (16 platos en 4 categorías)
└─ estructuras/    Pila.ts y Cola.ts (implementación propia)
```

### Estructuras propias (`src/estructuras`)

- **`Pila<T>`**: `#items`, `push`, `pop`, `tope`, getters `vacia` y `tamanio`, y `aArray()` (copia).
- **`Cola<T>`**: guarda un **índice de frente** (`#frente`) y **no usa `shift()`**; `encolar`,
  `desencolar`, `frente`, getters `vacia` y `tamanio`, y `aArray()`. Compacta el array cuando el
  frente crece demasiado.

### Estado global (`src/context/AppContext.tsx`)

El provider vive en el layout raíz. La sesión y la nota son estado de React; el **carrito (pila de
acciones)**, la **cola de pedidos** y la **pila de atendidos** viven en un store externo con
`useSyncExternalStore`, de modo que las estructuras mutables de `Pila`/`Cola` son la fuente de
verdad y React se entera de cada cambio.

- **Carrito + Deshacer**: cada «Agregar al carrito» hace `push` en la pila de acciones. El carrito
  agrupa por plato con cantidad. «Deshacer último» hace `pop` y quita una unidad del último plato
  agregado (la línea desaparece cuando llega a 0). El botón se deshabilita con la pila vacía.
- **Cola de pedidos**: al confirmar se asigna un número correlativo (`#001`, `#002`, …) y se
  **encola**. La cocina muestra `frente()` y «Atender siguiente» **desencola**; nadie se cuela.
- **Atendidos**: cada pedido atendido se apila; `/cocina/atendidos` lo muestra del **tope a la base**
  (último atendido primero).

---

## `replace` vs `push` en el flujo de confirmación

Al confirmar el pedido, la pantalla `/confirmar` navega al turno con **`router.replace()`** hacia
`/turno/[numero]`:

```ts
const numero = confirmarPedido();
router.replace({ pathname: '/turno/[numero]', params: { numero: String(numero) } });
```

**¿Por qué `replace` y no `push`?** Porque la confirmación **no debe quedar debajo del turno**. Si
usáramos `push`, al tocar «atrás» desde la pantalla del turno el usuario volvería al resumen de un
pedido **ya enviado**, lo que confunde y podría llevarlo a confirmar dos veces. Con `replace`, el
resumen se reemplaza por el turno y «atrás» vuelve a una pantalla coherente (la tab/ancla), no al
formulario de confirmación.

---

## Deep links

Con `"scheme": "comedoripf"` en `app.json` y `anchor: "(tabs)"` en el layout raíz.

- **App instalada (build propia):** `comedoripf://menu/7`
- **Expo Go en desarrollo** (IP de la compu de desarrollo, puerto 8081):

  ```
  exp://192.168.1.20:8081/--/menu/7
  ```

  `exp://<IP>:<puerto>` es el host de Expo Go; `/--/` separa ese host del **path de la app**, y
  `/menu/7` abre directamente el plato 7. (Reemplazá `192.168.1.20` por la IP que muestra
  `npx expo start`.)
- **Web:** `http://localhost:8081/menu/7`

> El `scheme` propio (`comedoripf://`) **no** funciona dentro de Expo Go: allí el scheme es
> `exp://`. `comedoripf://` solo se registra en una build propia (dev build o standalone).

---

## Capturas / video

| Archivo | Contenido |
|---------|-----------|
| [`assets/capturas/react3.mp4`](assets/capturas/react3.mp4) | 1) Carrito con **Deshacer último**. 2) Pantalla **Turno** (número, pedidos adelante y espera estimada). 3) **Cocina** como tab protegida atendiendo pedidos. 4) **Login / Logout** (la tab Cocina aparece y desaparece). |
| [`assets/capturas/react2.mp4`](assets/capturas/react2.mp4) | 5) Pantalla **404** al abrir una URL inexistente. |

Deep link de prueba para Expo Go (abre directo el plato 7): `exp://<IP>:8081/--/menu/7`
(ver [Deep links](#deep-links)).

---

## Desafíos opcionales implementados (G4)

- **Contador de pila** — `src/components/ContadorPila.tsx` usa `useNavigation().getState()` y muestra
  cuántas pantallas hay en la pila; se aplica como `headerTitle` del Stack de Menú (pasa de 1 a 2 al
  abrir `/menu/[id]`).
- **Tab protegida «Cocina»** — la sección Cocina (Drawer) vive dentro de la tab y aparece solo con
  sesión mediante `Tabs.Protected guard={conSesion}`; al cerrar sesión desaparece del historial.
- **Hoja inferior** — `/carrito/nota` se presenta con `presentation: 'formSheet'` y
  `sheetAllowedDetents: [0.5]`. En iOS es una hoja inferior; en Android cae a `modal` (limitación de
  `react-native-screens`).
- **Tiempo estimado** — `/turno/[numero]` calcula la espera como `posición × 3 min`, donde la
  posición es `pedidosAdelante + 1`.

---

## Preguntas frecuentes de la defensa (referencia rápida)

- **`/confirmar` → `/turno`**: `replace` (ver más arriba).
- **Logout en `/cocina/atendidos`**: esa pantalla deja de existir porque `(tabs)/cocina` está dentro
  de `Tabs.Protected guard={conSesion}`; no hace falta `router.back()`.
- **`/cocina` sin sesión → 404 esperado**: la tab está detrás de `Tabs.Protected guard={conSesion}`;
  abrir la URL directo (o refrescar la web) sin sesión cae en `+not-found`. Primero hay que iniciar
  sesión: Inicio → Cocina (`cocina` / `cocina123`).
- **Deshacer usa pila** porque se deshace **la última** acción (LIFO); **los pedidos usan cola**
  porque se atienden **por orden de llegada** (FIFO).
- **`comedoripf://menu/999`** → la ruta existe (`[id]`) pero la pantalla valida y muestra «No existe
  el plato». **`comedoripf://no-existe`** → `+not-found` (404).
- **Deep link a `/categorias/bebidas`** → debajo queda `(tabs)` gracias a
  `unstable_settings = { anchor: "(tabs)" }`.
