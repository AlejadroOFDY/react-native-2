# RESPUESTAS.md — Trabajo Práctico N° 2

**Taller Complementario — React Native II — Instituto Politécnico Formosa**
**Expo Router: rutas, navegación, pilas y colas (Expo SDK 57)**

---

## Parte A — Estructuras de datos: la pila y la cola

### A1. Conceptos

**a) ¿Qué significan LIFO y FIFO? ¿Cuál corresponde a cada estructura?**

- **LIFO** (*Last In, First Out*, «último en entrar, primero en salir»): el último elemento que
  ingresa es el primero en salir. Corresponde a la **pila** (Stack).
- **FIFO** (*First In, First Out*, «primero en entrar, primero en salir»): el primer elemento que
  ingresa es el primero en salir. Corresponde a la **cola** (Queue).

**b) ¿Por qué extremo entra y por qué extremo sale un elemento en cada estructura?**

- En la **pila**, el elemento entra y sale por el **mismo extremo**, llamado *tope*: `push()`
  agrega al tope y `pop()` retira del tope. Por eso el último que entró es el primero que sale.
- En la **cola**, el elemento entra por el **final** y sale por el **frente**: `encolar()` agrega
  al final y `desencolar()` retira del frente. Por eso el primero que llegó es el primero que sale.

**c) Ejemplo de la vida real y de una aplicación móvil para cada una.**

- **Pila**
  - Vida real: una pila de platos. El último plato que apoyás arriba es el primero que retirás.
  - App móvil: el historial de navegación «atrás», o la función **Deshacer** de un editor: se
    deshace la última acción realizada.
- **Cola**
  - Vida real: la fila del comedor o del banco. El primero que llega es el primero que se atiende.
  - App móvil: la cola de pedidos que llegan a la cocina, o una cola de reproducción de música:
    se respeta el orden de llegada.

### A2. Seguimiento de una pila

```js
const p = new Pila();
p.push('Inicio');       // [Inicio]
p.push('Productos');    // [Inicio, Productos]
p.push('Detalle 3');    // [Inicio, Productos, Detalle 3]
p.pop();                // saca 'Detalle 3' -> [Inicio, Productos]
p.push('Perfil');       // [Inicio, Productos, Perfil]
console.log(p.tope());   // (1)
console.log(p.pop());    // (2)
console.log(p.tope());   // (3)
console.log(p.vacia);    // (4)
```

Salidas:

| # | Expresión | Imprime | Estado de la pila (base → tope) |
|---|-----------|---------|---------------------------------|
|   | (tras los `push`/`pop`) | — | `[Inicio, Productos, Perfil]` |
| 1 | `p.tope()` | `'Perfil'` | `[Inicio, Productos, Perfil]` |
| 2 | `p.pop()` | `'Perfil'` | `[Inicio, Productos]` |
| 3 | `p.tope()` | `'Productos'` | `[Inicio, Productos]` |
| 4 | `p.vacia` | `false` | `[Inicio, Productos]` |

**Estado final (de base a tope):** `[Inicio, Productos]`.

### A3. Seguimiento de una cola

```js
const c = new Cola();
c.encolar('Ana');       // [Ana]
c.encolar('Beto');      // [Ana, Beto]
c.desencolar();         // sale 'Ana' -> [Beto]
c.encolar('Caro');      // [Beto, Caro]
c.encolar('Dani');      // [Beto, Caro, Dani]
console.log(c.frente());      // (1)
console.log(c.desencolar());  // (2)
console.log(c.vacia);         // (3)
```

Salidas:

| # | Expresión | Imprime | Estado de la cola (frente → final) |
|---|-----------|---------|------------------------------------|
|   | (tras los `encolar`/`desencolar`) | — | `[Beto, Caro, Dani]` |
| 1 | `c.frente()` | `'Beto'` | `[Beto, Caro, Dani]` |
| 2 | `c.desencolar()` | `'Beto'` | `[Caro, Dani]` |
| 3 | `c.vacia` | `false` | `[Caro, Dani]` |

**Estado final (de frente a final):** `[Caro, Dani]`.

### A4. Análisis de la implementación

**a) El array se declara como `#items`. ¿Qué significa el `#` y qué problema evita?**

`#items` es un **campo privado** (*private class field*) de JavaScript. Solo se puede acceder a él
desde dentro de la clase; desde afuera es inaccesible. Evita que código externo lea o modifique el
array interno (rompiendo los invariantes de la estructura) y encapsula la implementación. Además
es privacidad **real en tiempo de ejecución**, a diferencia de la palabra clave `private` de
TypeScript, que solo existe durante la compilación y desaparece en el JavaScript final.

**b) La cola usa `array.shift()` para desencolar. ¿Qué problema de rendimiento tiene con colas muy
grandes? ¿Cómo lo resuelven las colas «serias»?**

`shift()` es **O(n)**: al quitar el primer elemento, todos los elementos restantes deben
reindexarse (moverse una posición), y con una cola muy grande eso es costoso y crece con la
cantidad de elementos. Las colas «serias» mantienen un **índice de frente** (`#frente`) o usan una
estructura circular / lista enlazada, de modo que desencolar sea **O(1)** sin mover los demás
elementos. Cuando el índice de frente crece mucho, se compacta el array de vez en cuando.

**c) ¿Qué método de array usa la pila para sacar y cuál usa la cola? ¿Por qué no pueden usar el
mismo?**

La pila usa `pop()` (saca del final) y la cola saca del frente (en la versión vista en clase,
`shift()`; en la versión eficiente, el índice `#frente`). No pueden usar el mismo método porque
tienen semánticas opuestas: la pila saca por el **mismo extremo** por el que inserta (tope/final),
y la cola saca por el **extremo opuesto** (frente). Si la cola usara `pop()`, sacaría el último
elemento y dejaría de ser FIFO.

### A5. Programación: una cola eficiente

Implementación sin `shift()`, guardando el índice del frente en un campo privado (es la que está en
`src/estructuras/Cola.ts`, a la que se le agregó `aArray()`):

```js
class ColaEficiente {
  #items = [];
  #frente = 0;

  encolar(x) {
    this.#items.push(x);
  }

  desencolar() {
    if (this.vacia) return undefined;
    const x = this.#items[this.#frente];
    this.#items[this.#frente] = undefined; // libera la referencia
    this.#frente += 1;
    // Compactación ocasional para no acumular basura a la izquierda.
    if (this.#frente > 32 && this.#frente * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#frente);
      this.#frente = 0;
    }
    return x;
  }

  frente() {
    return this.vacia ? undefined : this.#items[this.#frente];
  }

  get vacia() {
    return this.#frente >= this.#items.length;
  }

  get tamanio() {
    return this.#items.length - this.#frente;
  }
}
```

### A6. Pila y cola dentro de Expo Router

**a) ¿Qué estructura describe el historial de pantallas de un Stack? ¿Qué pantalla es la visible y
qué operación hace «atrás»?**

Una **pila (LIFO)**. La pantalla visible es el **tope** de la pila (la última apilada). «Atrás» hace
un **pop**: retira la pantalla actual y deja a la vista la anterior.

**b) ¿Qué estructura usa Expo Router para las acciones de navegación? ¿Qué pasa si el usuario toca
dos links muy rápido?**

Una **cola (FIFO)**: las acciones de navegación se encolan y se procesan en orden de llegada. Si el
usuario toca dos links muy rápido, las dos acciones se encolan y se ejecutan en ese orden; no se
pierde ninguna y el resultado es determinista (primero la primera, luego la segunda).

---

## Parte B — Rutas basadas en archivos

### B1. Del archivo a la URL

| Archivo | URL que genera / función |
|---------|--------------------------|
| `src/app/(tabs)/index.tsx` | `/` — pantalla de Inicio. `(tabs)` es un grupo y no aparece en la URL; `index` es la ruta raíz. |
| `src/app/acerca.tsx` | `/acerca` |
| `src/app/(tabs)/perfil.tsx` | `/perfil` (el grupo `(tabs)` no aporta segmento) |
| `src/app/(tabs)/productos/index.tsx` | `/productos` |
| `src/app/(tabs)/productos/[id].tsx` | `/productos/:id` — pantalla dinámica; `id` llega como parámetro. |
| `src/app/docs/[...slug].tsx` | `/docs/*` — catch-all: `/docs/react`, `/docs/react/hooks/useState`, etc. `slug` es un array. |
| `src/app/_layout.tsx` | **No genera URL**: es el layout/navegador que envuelve a las rutas hijas. |
| `src/app/+not-found.tsx` | **No es una URL normal**: es la pantalla 404 que se muestra cuando ninguna ruta coincide. |
| `src/app/Boton.tsx` | Genera `/Boton` — **problema**: un componente dentro de `app/` se convierte en pantalla. Debe ir en `src/components`. |

### B2. De la URL al archivo

| URL | Archivo |
|-----|---------|
| `/categorias/bebidas` (y cualquier otra categoría) | `src/app/categorias/[categoria].tsx` |
| `/buscar?q=mate&categoria=kiosco` | `src/app/buscar.tsx` (los query params no son segmentos de archivo) |
| `/ayuda/pagos/tarjeta` y `/ayuda/horarios` | `src/app/ayuda/[...slug].tsx` (catch-all) |
| `/ayuda` (con una pantalla propia) | `src/app/ayuda/index.tsx` |

### B3. Verdadero o falso

| | Afirmación | Respuesta |
|---|------------|-----------|
| a | Cada pantalla nueva se debe registrar en una tabla de configuración. | **F** — Con *file-based routing* cada archivo dentro de `app/` es una ruta automáticamente; no hay tabla. |
| b | Los archivos `_layout.tsx` son pantallas visitables. | **F** — Definen navegadores/envoltorios; no son pantallas que el usuario visita. |
| c | Una carpeta entre paréntesis, como `(tabs)`, no aparece en la URL. | **V** |
| d | Para agregar una librería conviene `npm install` porque trae la última versión. | **F** — Conviene `npx expo install`, que instala la versión **compatible con el SDK**. `npm install` puede traer una versión incompatible con Expo Go. |
| e | `"main": "expo-router/entry"` reemplaza al viejo `App.tsx`. | **V** |
| f | La ruta `/_sitemap` lista todas las rutas y sirve para depurar. | **V** |
| g | Si existen `docs/index.tsx` y `docs/[...slug].tsx`, la URL `/docs` muestra `docs/index.tsx`. | **V** — `index` tiene prioridad sobre el catch-all. |
| h | En SDK 57, `expo-router` usa el mismo número de versión mayor que el SDK (57). | **V** |

---

## Parte C — Navegar: `<Link>`, router y la pila

### C1. Métodos de router

| Método | Qué le hace a la pila del Stack |
|--------|---------------------------------|
| `router.push(href)` | **Apila** una nueva pantalla en el tope (siempre agrega, aunque ya exista). |
| `router.navigate(href)` | Si la pantalla **ya está** en la pila, retrocede hasta ella; si no, la apila. Evita duplicados. |
| `router.replace(href)` | **Reemplaza** la pantalla actual: saca el tope y coloca la nueva. La pila no crece. |
| `router.back()` | **Pop**: vuelve a la pantalla anterior. |
| `router.dismissTo(href)` | Descarta pantallas hasta llegar a la indicada, que queda visible. |
| `router.dismissAll()` | Cierra todas las pantallas modales apiladas y vuelve al inicio del stack. |
| `router.canGoBack()` | **No modifica** la pila: devuelve `true`/`false` según haya algo debajo. |
| `router.setParams({...})` | Actualiza los parámetros de la ruta actual **sin** navegar ni tocar la pila. |

### C2. Simulación de la pila

Pila inicial: `[/productos]`. Estado **de base a tope** después de cada instrucción:

| # | Instrucción | Pila resultante |
|---|-------------|-----------------|
| 1 | `router.push("/productos/1")` | `[/productos, /productos/1]` |
| 2 | `router.push("/productos/2")` | `[/productos, /productos/1, /productos/2]` |
| 3 | `router.navigate("/productos/5")` | `[/productos, /productos/1, /productos/2, /productos/5]` (no estaba → apila) |
| 4 | `router.push("/perfil")` | `[/productos, /productos/1, /productos/2, /productos/5, /perfil]` |
| 5 | `router.replace("/buscar")` | `[/productos, /productos/1, /productos/2, /productos/5, /buscar]` |
| 6 | `router.back()` | `[/productos, /productos/1, /productos/2, /productos/5]` |
| 7 | `router.dismissTo("/productos")` | `[/productos]` |
| 8 | `router.canGoBack()` | Devuelve **`false`** (solo queda la raíz). |

### C3. ¿Link o router?

| Situación | ¿Link o router? | Método / prop y justificación |
|-----------|-----------------|-------------------------------|
| a) El usuario toca la tarjeta de un producto en una lista. | **`<Link>`** | `<Link href="/productos/1">`. Es una navegación declarativa por interacción del usuario. |
| b) Se guarda un formulario, la API responde OK y hay que mostrar éxito. | **`router`** | `router.replace('/exito')`: navegación imperativa después de lógica y sin volver al formulario. |
| c) Botón «Cancelar» dentro de un modal. | **`router`** | `router.back()` (o `router.dismiss()`): cierra el modal. |
| d) Después de un login exitoso hay que ir a la pantalla principal. | **`router`** | `router.replace('/')`: no queremos que «atrás» vuelva al login. |
| e) Volver desde el detalle a la lista que quedó tres pantallas más abajo. | **`router`** | `router.dismissTo('/pedidos')`: descarta las pantallas intermedias. |

### C4. Escribí el código

**a) Un `<Link>` que abra el producto con id 8 usando `href` como objeto.**

```tsx
<Link href={{ pathname: '/productos/[id]', params: { id: '8' } }}>
  Producto 8
</Link>
```

**b) Un `<Link>` a `/perfil` que siempre apile, aunque la pantalla ya exista.**

```tsx
<Link href="/perfil" push>
  Perfil
</Link>
```

**c) Un botón (`Pressable`) propio que funcione como link a `/carrito` usando `asChild`.**

```tsx
<Link href="/carrito" asChild>
  <Pressable style={({ pressed }) => [estilos.boton, pressed && estilos.pressed]}>
    <Text>Ir al carrito</Text>
  </Pressable>
</Link>
```

### C5. Pensar

En la web cada `<Link>` se convierte en un `<a href>` real. Ventajas concretas para el usuario:
puede **abrir el enlace en otra pestaña**, **copiar/pegar** la dirección, **compartir** el link, y
funcionan el **botón «atrás»** del navegador y la **accesibilidad** (es un enlace real). En el
celular no hay barra de direcciones: el «atrás» lo maneja el sistema operativo (botón o gesto), pero
Expo Router igual traduce el `href` a la ruta interna, y la misma URL sirve como **deep link** para
abrir la app en una pantalla concreta.

---

## Parte D — Navegadores: Stack, Tabs y Drawer

### D1. Comparación

| | Stack | Tabs | Drawer |
|--|-------|------|--------|
| ¿Apila pantallas? | Sí (pila) | Cada pestaña mantiene su propio historial/Stack | Sí, dentro de cada sección |
| ¿Cómo cambia de pantalla el usuario? | Al tocar (o después de lógica) y con «atrás» | Tocando la barra de pestañas | Deslizando desde el borde o abriendo el menú lateral |
| ¿Desde dónde se importa en SDK 57? | `expo-router` (`Stack`) | `expo-router/js-tabs` | `expo-router/drawer` |
| Caso de uso típico | Flujo lista → detalle → edición | Secciones principales (Inicio, Menú, Carrito) | Menú lateral para una sección (Cocina) |

### D2. Cada tab tiene su pila

Ve el **detalle del producto 4**. Cada pestaña conserva **su propia pila**: al cambiar de
pestaña no se pierde el estado; cuando vuelve a «Productos», la pila de esa pestaña sigue donde
estaba (con el detalle en el tope). Una app que se comporta así: **Instagram** (Inicio, Buscar,
Reels), **WhatsApp** (Chats, Estados, Llamadas) o **YouTube** (Inicio, Suscripciones, Biblioteca).

### D3. ¿Dónde va cada pantalla?

| Pantalla | Lugar | Por qué |
|----------|-------|---------|
| a) Detalle de un producto, manteniendo visible la barra de pestañas. | **Dentro de la tab** Productos (Stack anidado en la tab). | La barra de pestañas sigue visible. |
| b) Modal de confirmar compra, que debe tapar la barra. | **Stack raíz** con `presentation: 'modal'`. | Al estar fuera de las tabs, cubre toda la pantalla. |
| c) Login que se abre como modal. | **Stack raíz** con `presentation: 'modal'`. | Es transversal a las tabs y debe tapar todo. |
| d) «Mis pedidos anteriores» dentro de la sección Perfil. | **Dentro de la tab** Perfil (Stack anidado). | Pertenece al flujo de esa sección. |

### D4. Configurar el Stack

**a) ¿Qué diferencia hay entre `screenOptions` y las `options` de un `Stack.Screen`?**

`screenOptions` define opciones **por defecto para todas** las pantallas del Stack; `options` de un
`Stack.Screen` aplica **solo a esa pantalla** y tiene prioridad sobre las de `screenOptions`.

**b) ¿Por qué `(tabs)` tiene `headerShown: false`?**

Porque el grupo de tabs ya muestra encabezados propios (cada tab/Stack interno); si el Stack raíz
también mostrara header, se verían **dos encabezados** apilados.

**c) Si existe `src/app/perfil-publico.tsx` pero no está declarada en el Stack, ¿existe la
pantalla? ¿Para qué sirve declararla?**

**Sí existe**: Expo Router crea automáticamente toda pantalla cuyo archivo exista, aunque no se
declare. Declararla en el Stack sirve para **configurar sus opciones** (título, presentación,
header, etc.) y fijar su orden.

**d) Nombrá cuatro valores posibles de `presentation`. ¿Cuál usarías para una hoja inferior al 50%?**

`card`, `modal`, `transparentModal`, `containedModal`, `fullScreenModal`, `formSheet`. Para una hoja
inferior al 50%: `presentation: 'formSheet'` con `sheetAllowedDetents: [0.5]`.

**e) ¿Cómo cambiarías el título del header desde la propia pantalla de detalle para que diga
«Producto 7»?**

Desde la pantalla:

```tsx
<Stack.Screen options={{ title: 'Producto 7' }} />
```

o mediante `navigation.setOptions({ title: 'Producto 7' })`.

### D5. Tabs y Drawer en SDK 57

**a) ¿Qué cambió en SDK 57 al importar `Tabs`? ¿Qué alternativa experimental existe?**

El import recomendado es `import { Tabs } from 'expo-router/js-tabs'` (tabs basadas en React
Navigation; el `Tabs` exportado desde `expo-router` quedó deprecado para este uso). La alternativa
experimental son las **`NativeTabs`** de `expo-router/unstable-native-tabs`.

**b) ¿Qué dos paquetes necesita el Drawer y qué componente conviene poner en el layout raíz para
los gestos?**

`react-native-gesture-handler` y `react-native-reanimated`. Conviene envolver todo con
**`GestureHandlerRootView`** en el layout raíz.

**c) ¿Hace falta instalar `@react-navigation/drawer` en SDK 57? ¿Por qué?**

**No.** `expo-router/drawer` ya integra el drawer internamente (usa `react-native-drawer-layout`);
solo se instalan las dependencias nativas recomendadas con `npx expo install`.

**d) Si hay navegadores anidados, ¿en qué navegador actúa `router.back()`?**

En el **navegador más cercano que pueda retroceder**: primero resuelve el Stack interno (por
ejemplo el de la tab); si este ya está en su raíz, sube al navegador padre.

---

## Parte E — Rutas dinámicas, parámetros y hooks

### E1. Encontrá el error

El problema es que `useLocalSearchParams` devuelve el `id` como **string** (viene de la URL), pero el
`find` compara con `===` contra un `id` numérico: `3 === "3"` es `false`, por lo que nunca encuentra
el producto. Lo mismo pasa con `id === 3`. Corrección:

```tsx
export default function DetalleProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNumero = Number(id); // convertir el texto de la URL a número
  const producto = productos.find((p) => p.id === idNumero);

  if (!producto) return <Text>No existe el producto {id}</Text>;
  return <Text>{producto.nombre}</Text>;
}
```

### E2. Catch-all

Para `src/app/docs/[...slug].tsx`:

| URL | `slug` |
|-----|--------|
| `/docs/react` | `['react']` |
| `/docs/react/hooks/useState` | `['react', 'hooks', 'useState']` |
| `/docs` | No matchea el catch-all: resuelve a `docs/index.tsx` (si no existe, 404). `slug` no aplica. |

### E3. Anatomía de una URL

Dada `rutasipf://buscar?q=mate&categoria=bebidas`:

**a)** `scheme = rutasipf`; ruta = `/buscar`; parámetros de búsqueda = `q=mate`, `categoria=bebidas`.

**b)** `useLocalSearchParams()` en `buscar.tsx` devuelve `{ q: 'mate', categoria: 'bebidas' }`
(ambos como string).

**c)** **No** hacen falta corchetes: los query params (`?q=...`) no forman parte del *path*;
cualquier pantalla puede leerlos con `useLocalSearchParams` y actualizarlos con `router.setParams`.
Los corchetes son para segmentos dinámicos del path (como `[id]`).

**d)** Dos razones para usar `router.setParams({ q: texto })` en lugar de `router.push`:
1. `setParams` actualiza los parámetros de la pantalla actual **sin apilar** otra pantalla, así que
   no se llena la pila de búsquedas.
2. Mantiene la **URL sincronizada** con lo escrito, de modo que la búsqueda se puede compartir,
   recargar o deep-linkear.

### E4. ¿Dónde estoy?

| Hook | En `/productos/3` | En `/buscar?q=chipa` |
|------|-------------------|----------------------|
| `usePathname()` | `/productos/3` | `/buscar` |
| `useSegments()` | `['(tabs)', 'productos', '[id]']` | `['buscar']` |
| `useLocalSearchParams()` | `{ id: '3' }` | `{ q: 'chipa' }` |

> `useSegments()` devuelve los segmentos tal como están en el árbol de archivos: incluidos los
> grupos `(tabs)` y el nombre del segmento dinámico `[id]` (no el valor resuelto).

### E5. Local vs global

**a) Diferencia entre `useLocalSearchParams` y `useGlobalSearchParams`. ¿Cuál es la opción por
defecto y por qué?**

`useLocalSearchParams` devuelve los parámetros **de la pantalla actual** (en su segmento de
layout); `useGlobalSearchParams` devuelve los parámetros de la **ruta global activa** y se actualiza
con cualquier cambio de ruta de la app, lo que puede provocar re-renders innecesarios. La opción
recomendada/por defecto es `useLocalSearchParams` porque es más predecible y eficiente.

**b) ¿Para qué sirve `useFocusEffect`? Ejemplo.**

Ejecuta un efecto cuando la pantalla **gana foco** y lo limpia cuando pierde foco (pausa/reanuda).

```tsx
useFocusEffect(
  useCallback(() => {
    console.log('La pantalla ganó foco');
    return () => console.log('La pantalla perdió foco');
  }, []),
);
```

**c) `/productos/mate` abre la pantalla de detalle aunque no exista ese producto. ¿Es un error de
Expo Router? ¿De quién es la responsabilidad?**

**No** es un error de Expo Router: el router resuelve la **ruta** (el patrón `[id]` matchea). Que el
valor del parámetro corresponda a algo existente es **responsabilidad de la pantalla**, que debe
validar el `id` y mostrar un mensaje si no existe.

---

## Parte F — Redirecciones, rutas protegidas y deep links

### F1. Redirect

**a) ¿Qué hace `<Redirect href="/productos" />` y a qué método de router equivale?**

Redirige **declarativamente** a otra ruta durante el render (reemplaza la pantalla actual). Equivale
a `router.replace('/productos')`.

**b) ¿Por qué una redirección debe reemplazar y no apilar? Describí el problema.**

Debe **reemplazar** para que «atrás» no vuelva a la pantalla que redirigió. Si apilara, la pantalla
origen quedaría debajo; al tocar «atrás», el usuario volvería a ella y esta redirigiría de nuevo,
produciendo un **bucle** o una navegación confusa.

### F2. `Stack.Protected`

Guards:

```tsx
<Stack.Protected guard={conSesion}>
  <Stack.Screen name="privado" />
</Stack.Protected>

<Stack.Protected guard={!conSesion}>
  <Stack.Screen name="login" options={{ presentation: 'modal' }} />
</Stack.Protected>
```

**a) ¿Qué le pasa a una pantalla cuando su guard es `false`?**

La pantalla (y sus hijas) **deja de existir** en el navegador: se quita del historial y no se puede
navegar a ella (da *unmatched* / 404). Si el usuario estaba ahí, es redirigido a la primera ruta
disponible/ancla.

**b) Al iniciar sesión, el modal de login se cierra solo, sin llamar a `router.back()`. ¿Por qué?**

Porque al iniciar sesión `conSesion` pasa a `true` y el guard `!conSesion` se vuelve `false`, lo que
**quita** la pantalla `login` del navegador. El modal que la contenía se **desmonta solo**; no hace
falta llamar a `router.back()`.

**c) Aparece el aviso «The action 'NAVIGATE' … was not handled by any navigator». ¿Qué lo causa y
cómo se evita?**

Se produce cuando se intenta navegar (con `router.push`, etc.) hacia una ruta que **ya no está
montada** (por ejemplo, una sección protegida que desapareció tras cerrar sesión). Se evita **no
navegando manualmente a rutas inexistentes/no permitidas** y dejando que los guards gestionen la
transición (p. ej., al cerrar sesión llamar solo a `logout()` y dejar que el guard saque la
sección).

**d) ¿Qué ventaja tiene `Stack.Protected` frente a un `<Redirect>` condicional en cada pantalla?**

Centraliza la protección en el layout, **agrega/elimina rutas del historial automáticamente** y
evita repetir lógica en cada pantalla. Con `<Redirect>` en cada pantalla es fácil olvidarse, la ruta
queda montada un instante y el historial no se limpia.

### F3. 404, anchor y rutas tipadas

**a) `+not-found.tsx`** — pantalla 404; se muestra cuando ninguna ruta coincide con la URL. Se
define en `src/app/+not-found.tsx`.

**b) `export const unstable_settings = { anchor: "(tabs)" }`** — define el **ancla** de la pila
raíz: al abrir una ruta profunda (deep link), debajo queda el grupo `(tabs)` en lugar de no tener
nada. Se define en el `_layout.tsx` raíz.

**c) `typedRoutes`** — genera tipos TypeScript para las rutas. Si escribís
`<Link href="/prodcutos" />` (mal escrito), TypeScript marca el error. Los tipos se generan en
`.expo/types/router.d.ts` a partir de los archivos de `src/app`, cuando corrés la app
(`expo start` / `expo export`).

### F4. Deep links

`scheme = "comedoripf"`, IP de desarrollo `192.168.1.20`, ruta `/menu/7`:

| Dónde | URL |
|-------|-----|
| App instalada (build propia) | `comedoripf://menu/7` |
| Expo Go en desarrollo | `exp://192.168.1.20:8081/--/menu/7` |
| Web (`npx expo start --web`) | `http://localhost:8081/menu/7` |

**¿Qué significa `/--/`?** Separa la URL del **host de desarrollo** (lo que va antes, `exp://host:puerto`)
del **path de la app** (lo que va después). **¿Por qué el scheme propio no funciona dentro de Expo
Go?** Porque Expo Go es una **única app instalada** con su propio scheme (`exp://`); el sistema
operativo solo registra `comedoripf://` cuando instalás una **build propia** de la app (dev build o
standalone).

### F5. Errores comunes

**a)** `Link asChild` pasa props a un **único hijo** que debe reenviarlas; pasarle un `style` como
**array** a un hijo directo de `<Slot>` genera el aviso. Solución: usar `asChild` con un componente
que reenvíe props (como un `Pressable`) y aplicar el estilo dentro, p. ej.
`style={({ pressed }) => [estilos.boton, pressed && estilos.pressed]}`; no pasar el array directo al
hijo de `asChild`.

**b)** Poner `TarjetaProducto.tsx` en `src/app` lo convierte en una **ruta** `/TarjetaProducto`. Los
componentes reutilizables van **fuera de `app/`**, en `src/components`.

**c)** `router.push('/')` tras el login **apila** la home sobre el login, así que «atrás» vuelve al
login. Solución: `router.replace('/')`, o (si el login es una ruta protegida que desaparece al
iniciar sesión) **no navegar** y dejar que el guard la cierre.

**d)** Expo Go trae solo sus módulos nativos; instalar con `npm install` puede traer una versión
incompatible. Solución: usar `npx expo install <paquete>` (resuelve la versión compatible) y, si el
paquete tiene código nativo que Expo Go no incluye, crear un **development build**
(`npx expo run:android` o `eas build --profile development`).
