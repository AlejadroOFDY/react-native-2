# Defensa oral — Mantenimiento IPF (TP3)

> Guía de estudio desde cero. No hace falta que sepas React Native de memoria:
> acá está lo mínimo para entender tu propio código y responder con seguridad.
>
> **Cómo usarla:** leé una vez de corrido, después estudiá las secciones 3, 4 y 8
> (Expo Router, tabs y avisos), y al final practicá en voz alta las preguntas de las
> secciones 9 y 10.

### Respuestas de bolsillo (para memorizar)

- **¿Usaste Expo Router?** Sí. Es la navegación basada en archivos de Expo: cada archivo
  dentro de `src/app` es una ruta y los `_layout.tsx` definen el navegador. El layout
  raíz es un Stack y adentro hay un grupo `(tabs)` con tres pestañas.
- **¿Qué son las tabs?** Son las pestañas inferiores (Reportes, Avisos y Permisos). Se
  declaran en `src/app/(tabs)/_layout.tsx` con `Tabs` y `Tabs.Screen`; cada una apunta a
  un archivo distinto y la barra queda fija.
- **¿Dónde se muestran los avisos?** En **`src/app/(tabs)/avisos.tsx`**. Los datos salen
  de `useReportes()` (`src/lib/reportes.tsx`), se crean en `resolverReporte()` y el badge
  de no leídos se calcula en `src/app/(tabs)/_layout.tsx`.

### Plan de estudio en 3 días

- **Día 1:** secciones 1 a 5 (la app, glosario, Expo Router, tabs y mapa del proyecto).
- **Día 2:** secciones 6 a 8 (flujo, permisos y avisos). Abrí los archivos mientras leés.
- **Día 3:** secciones 9 a 13. Contestá en voz alta y practicá la demo de 3 minutos.

---

## 1. La app en 30 segundos

**Mantenimiento IPF** es una app para que alumnos y docentes reporten desperfectos del
edificio (una luz quemada, una canilla que pierde, un proyector roto) y reciban un aviso
cuando se resuelven.

- Hecha con **React Native** + **Expo SDK 57** + **TypeScript**.
- Navegación con **Expo Router**.
- Datos guardados **solo en el teléfono** (no hay backend).
- Usa **cámara** (QR y fotos), **ubicación** (primer plano), **fotos** (selector del
  sistema) y **notificaciones locales**.
- Tiene tres pestañas: **Reportes**, **Avisos** y **Permisos**.

Frase para empezar la defensa:

> “Es una app móvil en Expo/React Native donde el usuario carga reportes de
> desperfectos, puede escanear el QR del aula, adjuntar una foto y marcar la ubicación.
> Los reportes se guardan localmente y, al simular la resolución, se genera un aviso en
> la bandeja y una notificación local. Todo el manejo de permisos está centralizado en
> un hook propio.”

---

## 2. Glosario mínimo

| Término | Qué es, en simple |
| --- | --- |
| **React Native** | Framework para hacer apps móviles con JavaScript/TypeScript y componentes parecidos a React. |
| **Expo** | Conjunto de herramientas y módulos que simplifican React Native: cámara, ubicación, notificaciones, builds, etc. |
| **Expo SDK** | La versión del conjunto de módulos de Expo. Este TP usa **SDK 57**. |
| **Expo Go** | App genérica que instala el usuario para probar proyectos Expo sin compilar. Tiene su propio manifiesto y no aplica la configuración nativa del proyecto. |
| **Development build** | Un APK propio de la app, compilado con su configuración nativa (permisos, textos, plugins). Es lo que se usa para probar lo que Expo Go no puede. |
| **Metro** | El “empaquetador” de JavaScript. Sirve el código al teléfono y permite **Fast Refresh** (los cambios se ven al instante sin recompilar). |
| **Expo Router** | Sistema de navegación de Expo basado en **archivos**: cada archivo dentro de `src/app` es una ruta. |
| **Layout** | Archivo `_layout.tsx` que envuelve a las rutas de una carpeta y define el navegador (Stack, Tabs, etc.). |
| **Stack** | Navegador de “pila”: apila pantallas, muestra botón de volver y permite modales. |
| **Tabs** | Navegador de pestañas inferiores: cambia entre pantallas sin apilarlas. |
| **Ruta** | Una URL/pantalla. Por ejemplo `/avisos` o `/reporte/123`. |
| **Ruta dinámica** | Ruta con un parámetro entre corchetes: `[id].tsx` o `[recurso].tsx`. |
| **Grupo de rutas** | Carpeta entre paréntesis, como `(tabs)`. Agrupa rutas **sin** agregar un segmento a la URL. |
| **Componente** | Función que devuelve interfaz (JSX). Ej.: `Boton`, `Pantalla`. |
| **Prop** | Dato que se le pasa a un componente. Ej.: `<Boton titulo="Guardar" />`. |
| **Hook** | Función que empieza con `use` y usa estado/ciclo de vida de React. Ej.: `usePermiso()`. |
| **Estado** | Dato que, cuando cambia, vuelve a dibujar la pantalla. Se usa con `useState`. |
| **Contexto / Provider** | Forma de compartir estado entre muchas pantallas sin pasar props una por una. |
| **TypeScript** | JavaScript con tipos. Los errores se detectan al compilar con `tsc --noEmit`. |
| **Permiso** | Autorización que el sistema operativo exige para usar un recurso (cámara, ubicación, notificaciones). |
| **Declarar** | Avisar en la configuración nativa que la app podría usar un permiso (AndroidManifest / Info.plist). |
| **Solicitar** | Pedir el permiso en tiempo de ejecución, lo que muestra el diálogo del sistema. |
| **Manifiesto** | `AndroidManifest.xml`: archivo de Android donde se declaran permisos y componentes. |
| **Info.plist** | Archivo de iOS donde se declaran permisos y los “textos de propósito”. |
| **Config plugin** | Función de Expo que modifica los archivos nativos durante el `prebuild` a partir de `app.json`. |
| **Prebuild / CNG** | Generar las carpetas `android/` e `ios/` a partir de `app.json`. Esas carpetas no se editan a mano ni se suben al repo. |
| **EAS** | Servicio en la nube de Expo para compilar el APK/IPA. |
| **OTA** | Actualización “over the air”: solo JavaScript y assets, no cambios nativos. |
| **kv-store** | Almacenamiento clave-valor local (`expo-sqlite/kv-store`), parecido a AsyncStorage. |

---

## 3. Expo Router explicado desde cero

### 3.1. ¿Qué es?

Expo Router es la parte de Expo que se encarga de la **navegación**. Su idea es:

> **Cada archivo dentro de `src/app` es una pantalla, y la carpeta donde está define su
> URL.**

No hay que registrar las pantallas en una lista gigante: el archivo *es* la ruta.
Está construido arriba de React Navigation, pero con navegación basada en archivos.

### 3.2. Tu árbol de rutas

```
src/app/
├── _layout.tsx                 ← Stack raíz (navegador principal)
├── (tabs)/
│   ├── _layout.tsx             ← Tabs (barra inferior)
│   ├── index.tsx               →  /
│   ├── avisos.tsx              →  /avisos
│   └── permisos.tsx            →  /permisos
├── permisos/
│   └── [recurso].tsx           →  /permisos/camara, /permisos/ubicacion, ...
├── reporte/
│   ├── nuevo.tsx               →  /reporte/nuevo
│   ├── escanear.tsx            →  /reporte/escanear
│   ├── foto.tsx                →  /reporte/foto
│   ├── ubicacion.tsx           →  /reporte/ubicacion
│   └── [id].tsx                →  /reporte/123
└── ajustes-app.tsx             →  /ajustes-app
```

Reglas que tenés que poder explicar:

- **`index.tsx`** es la ruta principal de una carpeta. En `(tabs)/index.tsx` es `/`.
- **`_layout.tsx`** no es una pantalla: es el **navegador** que envuelve a las rutas de
  esa carpeta. El `_layout.tsx` raíz define un **Stack**; el de `(tabs)` define las
  **Tabs**.
- **`(tabs)`** es un **grupo de rutas**: los paréntesis hacen que la carpeta no aparezca
  en la URL. Por eso `(tabs)/avisos.tsx` es `/avisos` y no `/tabs/avisos`.
- **`[id].tsx`** y **`[recurso].tsx`** son **rutas dinámicas**: el valor entre corchetes
  se lee con `useLocalSearchParams()`.
- Los archivos que no están en `(tabs)` (por ejemplo `reporte/nuevo.tsx`) se abren
  **encima** de las tabs, dentro del Stack raíz, y tienen botón de volver.
- El modal de la pantalla previa se configura en el Stack raíz con
  `presentation: 'modal'` para `/permisos/[recurso]`.

### 3.3. Stack vs Tabs

| | **Stack** | **Tabs** |
| --- | --- | --- |
| Qué hace | Apila pantallas una arriba de otra | Cambia entre pantallas desde una barra inferior |
| Botón volver | Sí | No (cambia de pestaña) |
| Ejemplo en la app | `/reporte/nuevo`, `/reporte/escanear`, el modal de permisos | Reportes, Avisos, Permisos |
| Archivo | `src/app/_layout.tsx` | `src/app/(tabs)/_layout.tsx` |

### 3.4. ¿Cómo se navega en el código?

Se usa el objeto `router` de Expo Router:

```ts
router.push('/reporte/nuevo');                 // abre una pantalla
router.replace('/');                           // reemplaza la actual
router.back();                                 // vuelve atrás
router.push({ pathname: '/reporte/[id]', params: { id } });
```

También existe `useLocalSearchParams()` para leer parámetros:

```ts
const { id } = useLocalSearchParams<{ id: string }>();
```

### 3.5. ¿Qué son las “rutas tipadas”?

En `app.json` está activado `experiments.typedRoutes: true`. Expo genera tipos de las
rutas y TypeScript te avisa si escribís una ruta que no existe. Por eso `router.push()`
no acepta cualquier string.

### 3.6. Respuesta modelo si te preguntan “¿Usaste Expo Router?”

> “Sí. Expo Router es un sistema de navegación basado en archivos: cada archivo dentro de
> `src/app` es una ruta y cada carpeta puede tener un `_layout.tsx` que define el
> navegador. En mi app el layout raíz es un Stack, y adentro tengo un grupo `(tabs)` con
> tres pestañas. Las rutas dinámicas como `[id].tsx` las uso para el detalle de un
> reporte. También activé `typedRoutes`, así que las rutas están validadas por
> TypeScript.”

---

## 4. ¿Qué son las tabs?

Las **tabs** (pestañas) son la barra de navegación que está siempre abajo de la pantalla.
Cada pestaña muestra una pantalla distinta y no se apilan: al tocar otra, cambiás de
sección. En tu app hay tres:

| Tab | Archivo | URL |
| --- | --- | --- |
| Reportes | `src/app/(tabs)/index.tsx` | `/` |
| Avisos | `src/app/(tabs)/avisos.tsx` | `/avisos` |
| Permisos | `src/app/(tabs)/permisos.tsx` | `/permisos` |

El navegador se define en **`src/app/(tabs)/_layout.tsx`**:

```tsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Reportes', tabBarIcon: ... }} />
  <Tabs.Screen name="avisos" options={{ title: 'Avisos', tabBarBadge: noLeidos }} />
  <Tabs.Screen name="permisos" options={{ title: 'Permisos', tabBarIcon: ... }} />
</Tabs>
```

- `Tabs` crea el navegador de pestañas.
- `Tabs.Screen` registra una pantalla; `name` coincide con el nombre del archivo
  (sin `.tsx`).
- `options` define el título, el ícono (`tabBarIcon`, con MaterialCommunityIcons) y el
  badge de avisos no leídos (`tabBarBadge`).
- La barra se estiliza en `screenOptions` (colores, borde, tamaños).

Usé el navegador **`Tabs` de Expo Router** (no `NativeTabs`) para tener un único layout
para Android y evitar variantes por plataforma. Los íconos son de
`@expo/vector-icons` (MaterialCommunityIcons).

### ¿Por qué las demás pantallas no están en tabs?

Porque no son secciones principales: “Nuevo reporte” es un flujo que se abre encima, y
el detalle de un reporte depende de un id. Eso va en el **Stack** raíz, con botón de
volver. Las tabs quedan para las tres secciones fijas.

### Respuesta modelo si te preguntan “¿Qué son las tabs?”

> “Son las pestañas inferiores de navegación. En Expo Router se crean con un layout que
> usa el componente `Tabs` y declara cada pantalla con `Tabs.Screen`. En mi app hay tres:
> Reportes, Avisos y Permisos. La barra queda fija y cada pestaña apunta a un archivo
> distinto dentro de `src/app/(tabs)`. El badge de Avisos se calcula con la cantidad de
> avisos no leídos del contexto.”

---

## 5. Mapa del proyecto

```
tp3/
├── src/
│   ├── app/                 ← rutas (pantallas y navegadores)
│   ├── components/          ← piezas reutilizables de UI
│   ├── hooks/               ← lógica reutilizable de React
│   ├── lib/                 ← datos, permisos, notificaciones, tipos
│   └── constants/           ← colores, espaciados, radios
├── assets/                  ← íconos e imágenes de la app
├── docs/                    ← capturas y video de la entrega
├── app.json                 ← configuración de Expo
├── eas.json                 ← perfiles de build (EAS)
├── package.json             ← dependencias y scripts
├── RESPUESTAS.md            ← Parte A–F del TP
└── defensa.md               ← este archivo
```

### ¿Qué va en cada carpeta?

- **`src/app`**: solo rutas. Acá no va lógica pesada; las pantallas componen
  componentes y llaman hooks.
- **`src/components`**: UI reutilizable (`Boton`, `Campo`, `Tarjeta`, `BadgeEstado`,
  `Pantalla`, etc.).
- **`src/hooks`**: hooks propios (`usePermiso`, `useRevisarAlVolver`).
- **`src/lib`**: lógica de datos y permisos (`permisos.ts`, `reportes.tsx`,
  `notificaciones.ts`, `almacen.ts`, `borrador.tsx`, `tipos.ts`).
- **`src/constants/theme.ts`**: colores claro/oscuro, espaciados y radios.

### Índice rápido: “¿Dónde está…?”

| Quiero ver… | Archivo |
| --- | --- |
| Las tres tabs y sus íconos | `src/app/(tabs)/_layout.tsx` |
| La lista de reportes | `src/app/(tabs)/index.tsx` |
| **La bandeja de avisos** | **`src/app/(tabs)/avisos.tsx`** |
| El panel de permisos | `src/app/(tabs)/permisos.tsx` |
| El formulario de nuevo reporte | `src/app/reporte/nuevo.tsx` |
| El escáner QR | `src/app/reporte/escanear.tsx` |
| La foto (cámara/galería) | `src/app/reporte/foto.tsx` |
| La ubicación y el sector | `src/app/reporte/ubicacion.tsx` |
| El detalle y “Simular resolución” | `src/app/reporte/[id].tsx` |
| La pantalla previa de permisos | `src/app/permisos/[recurso].tsx` |
| El interruptor de avisos | `src/app/ajustes-app.tsx` |
| El Stack raíz y los providers | `src/app/_layout.tsx` |
| La lógica de permisos | `src/lib/permisos.ts` |
| El hook de permisos | `src/hooks/usePermiso.ts` |
| El refresco al volver de Ajustes | `src/hooks/useRevisarAlVolver.ts` |
| Los reportes y avisos (estado) | `src/lib/reportes.tsx` |
| La persistencia | `src/lib/almacen.ts` |
| Las notificaciones locales | `src/lib/notificaciones.ts` |
| El borrador del formulario | `src/lib/borrador.tsx` |
| Los tipos y categorías | `src/lib/tipos.ts` |
| Los permisos y plugins de la app | `app.json` |
| El perfil de development build | `eas.json` |

---

## 6. Recorrido de la app (flujo completo)

1. **Inicio** (`src/app/(tabs)/index.tsx`): muestra los reportes guardados con su estado
   (pendiente, en curso, resuelto) y el botón “Nuevo reporte”. Si no hay, muestra un
   estado vacío.
2. **Nuevo reporte** (`src/app/reporte/nuevo.tsx`): pide título, descripción, aula y
   categoría. Los datos se guardan en un **borrador** (`BorradorProvider`) para no
   perderlos al ir a escanear, foto o ubicación.
3. **Escanear QR** (`src/app/reporte/escanear.tsx`): pide cámara con el hook, muestra los
   cuatro estados y, al leer el QR, escribe el aula y vuelve al formulario. Si se
   deniega, se puede escribir a mano.
4. **Foto** (`src/app/reporte/foto.tsx`): “Sacar foto” usa `CameraView` y
   `takePictureAsync`; “Elegir de la galería” usa `ImagePicker.launchImageLibraryAsync`
   **sin pedir permiso**.
5. **Ubicación** (`src/app/reporte/ubicacion.tsx`): pide solo ubicación en primer plano;
   si es aproximada, muestra “Ubicación aproximada” sin coordenadas; si se deniega, se
   elige un sector (Patio, Estacionamiento, Pasillo, etc.).
6. **Guardar**: crea el reporte en `ReportesProvider` y navega al detalle con
   `router.replace`.
7. **Detalle** (`src/app/reporte/[id].tsx`): muestra los datos, la foto, la ubicación o
   sector y el estado. Si el id no existe, muestra “Reporte no encontrado”. Tiene
   “Simular resolución” y “Eliminar reporte”.
8. **Simular resolución**: `resolverReporte()` cambia el estado a resuelto y agrega un
   aviso en la bandeja. Si el permiso de notificaciones está concedido y el interruptor
   está activo, `programarAvisoResolucion()` agenda una notificación local a los 10 s.
9. **Avisos** (`src/app/(tabs)/avisos.tsx`): lista los avisos guardados, permite marcar
   como leídos y muestra el badge de no leídos en la tab.
10. **Permisos** (`src/app/(tabs)/permisos.tsx`): muestra el estado de cámara, ubicación,
    notificaciones y fotos, con la plataforma y el matiz (aproximada, limitada,
    provisional).
11. **Pantalla previa** (`src/app/permisos/[recurso].tsx`): explica el beneficio, tiene
    “Continuar” para pedir el permiso o “Abrir Ajustes” si está bloqueado.
12. **Ajustes de la app** (`src/app/ajustes-app.tsx`): interruptor de avisos, estado del
    permiso, ruta de Ajustes si está bloqueado y “Borrar todos los reportes”.

---

## 7. Permisos explicados de cero

### 7.1. Declarar no es lo mismo que solicitar

- **Declarar**: dejar anotado en el manifiesto de Android o en el `Info.plist` de iOS que
  la app puede necesitar un permiso. Se hace en **tiempo de compilación**.
- **Solicitar**: llamar a la API en el momento de uso para que el sistema muestre el
  diálogo. Se hace en **tiempo de ejecución**.

En Expo, la declaración se configura en **`app.json`** con los plugins:

```jsonc
["expo-camera", { "cameraPermission": "...", "microphonePermission": false }]
```

y los permisos que no se usan se quitan con **`android.blockedPermissions`**.

### 7.2. Los cuatro estados

| Estado en la app | Qué significa | `status` de Expo | `canAskAgain` |
| --- | --- | --- | --- |
| `cargando` | Todavía no se consultó | — | — |
| `concedido` | Ya hay acceso | `granted` | — |
| `preguntable` | Se puede mostrar el diálogo | `undetermined` o `denied` | `true` |
| `bloqueado` | No se puede volver a preguntar | `denied` | `false` |

Campos clave:

- **`granted`**: ¿hay acceso ahora?
- **`canAskAgain`**: ¿el sistema permite volver a mostrar el diálogo?
- **`status`**: el estado crudo.
- **`accessPrivileges`**: en fotos, `all` o `limited`.
- **`accuracy`**: en ubicación, `fine`/`coarse` (Android) o `full`/`reduced` (iOS).

### 7.3. El hook `usePermiso`

Archivo: **`src/hooks/usePermiso.ts`**.

Hace tres cosas:

1. **Consulta** el permiso al montar la pantalla y al volver de Ajustes.
2. **Traduce** la respuesta de Expo a `cargando / concedido / preguntable / bloqueado`,
   más `parcial` y `detalle`.
3. Expone **`pedir()`** y **`abrirAjustes()`**.

Se usa así:

```ts
const permiso = usePermiso('camara');
// permiso.estado, permiso.parcial, permiso.detalle
// permiso.pedir(), permiso.abrirAjustes()
```

### 7.4. La traducción de estados

Archivo: **`src/lib/permisos.ts`**, función `mapearRespuesta`.

- Si `granted` → **concedido**.
- Si `undetermined` o `canAskAgain !== false` → **preguntable**.
- Si `denied` y no se puede volver a preguntar → **bloqueado**.

**Detalle importante de Android:** un permiso “Solo esta vez” vencido también devuelve
`canAskAgain: false`, igual que uno bloqueado. Para no confundirlos, la app guarda un
flag propio (`permiso-bloqueado:<recurso>`) que solo se activa cuando un `request…()`
real confirma que quedó bloqueado. Si no hay flag, se muestra **Preguntable** con el
detalle “Permiso temporal vencido: se puede volver a pedir”. En iOS sí se mantiene
estricto: `denied` + `canAskAgain: false` es bloqueado.

### 7.5. ¿Qué significa “parcial”?

- **Ubicación aproximada**: `android.accuracy === 'coarse'` o
  `ios.accuracy === 'reduced'`. La app no muestra coordenadas exactas.
- **Fotos limitadas**: `accessPrivileges === 'limited'`.
- **Notificaciones provisionales** (iOS): llegan en silencio, sin diálogo.

### 7.6. La pantalla previa

Antes de cada diálogo del sistema se muestra **`/permisos/[recurso]`**:

- una frase con el beneficio concreto (“Usamos tu cámara para…”),
- un único botón **“Continuar”**,
- la aclaración de que se puede cambiar en Ajustes.

Si el permiso está bloqueado, muestra la ruta exacta de Ajustes según la plataforma
(`rutaAjustes()` en `src/lib/permisos.ts`) y el botón pasa a **“Abrir Ajustes”**.

### 7.7. ¿Y si el usuario dice que no?

Ningún permiso bloquea el reporte:

| Permiso | Alternativa |
| --- | --- |
| Cámara | Escribir el aula a mano / elegir foto de la galería |
| Ubicación | Elegir el sector a mano |
| Notificaciones | Leer el aviso en la bandeja `/avisos` |
| Fotos | Usar el selector del sistema (no requiere permiso) |

### 7.8. ¿Cómo se entera la app de que cambió el permiso en Ajustes?

Archivo: **`src/hooks/useRevisarAlVolver.ts`**.

Escucha **`AppState`**: cuando la app pasa a `active` después de haber estado afuera,
llama a `refrescar()` del hook. Así el panel y las pantallas vuelven a consultar el
estado real. En Android, si revocás un permiso mientras la app está abierta, el sistema
puede **matar el proceso**; al reabrir, la app consulta de nuevo.

### 7.9. Textos de propósito

En iOS, cada permiso necesita una frase en el `Info.plist`
(`NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`, etc.). Esa frase
aparece **dentro del diálogo de iOS**. Si falta, la app se cierra y App Store rechaza la
build.

En Android **no** existe ese texto: el diálogo lo arma el sistema y no se puede
personalizar. Por eso la explicación se muestra en la pantalla previa de la app. En
`app.json` las frases están en las opciones de los plugins y en `ios.infoPlist`.

### 7.10. Permisos que se bloquearon a propósito

En `app.json`, `android.blockedPermissions`:

- `RECORD_AUDIO`: la app no graba audio.
- `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE`: usamos el selector del sistema.
- `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` / `READ_MEDIA_AUDIO`: no leemos la galería
  completa.
- `SYSTEM_ALERT_WINDOW`: no mostramos overlays.
- `ACCESS_BACKGROUND_LOCATION`: solo usamos ubicación en primer plano.

Esto se llama **mínimo privilegio**: pedir solo lo que la función necesita.

---

## 8. “¿Dónde se muestran los avisos?” (pregunta típica)

Respondé en este orden:

1. **La pantalla** es **`src/app/(tabs)/avisos.tsx`**. Ahí se llama a `useReportes()` y se
   recorre el array `avisos` con `.map()`, mostrando título, cuerpo, fecha y si está
   leído. También hay un botón “Marcar leídos”.
2. **Los datos** viven en **`src/lib/reportes.tsx`**, dentro de `ReportesProvider`. El
   hook `useReportes()` devuelve `avisos`, `noLeidos`, `marcarAvisosLeidos`, etc.
3. **El aviso se crea** en la función **`resolverReporte(id)`** de
   `src/lib/reportes.tsx`: cambia el reporte a `resuelto` y agrega un objeto `Aviso` al
   principio del array.
4. **El badge de la tab** se calcula en **`src/app/(tabs)/_layout.tsx`**:
   `tabBarBadge: noLeidos > 0 ? noLeidos : undefined`.
5. **La notificación del sistema** se programa en **`src/lib/notificaciones.ts`**, función
   `programarAvisoResolucion()`, y se dispara desde el botón “Simular resolución” en
   **`src/app/reporte/[id].tsx`**.
6. **La persistencia** está en **`src/lib/almacen.ts`**: todo el estado se guarda como
   JSON bajo la clave `mantenimiento-ipf:v1` con `expo-sqlite/kv-store`.

Frase corta:

> “La bandeja está en `src/app/(tabs)/avisos.tsx`; los avisos salen del
> `ReportesProvider` en `src/lib/reportes.tsx`; se crean en `resolverReporte()`; el badge
> de la tab se arma en `(tabs)/_layout.tsx`; y la notificación local se programa en
> `src/lib/notificaciones.ts`.”

---

## 9. Las 6 preguntas de la defensa (G6) con respuesta modelo

### 1. “Mostrá el código que decide entre Continuar y Abrir Ajustes. ¿Qué campo lo decide?”

Archivo: **`src/app/permisos/[recurso].tsx`**.

- El estado viene de `usePermiso(recurso)`.
- El botón se arma con una condición: si `permiso.estado === 'bloqueado'`, el título es
  **“Abrir Ajustes”** y llama a `permiso.abrirAjustes()` (que usa
  `Linking.openSettings()`); si no, es **“Continuar”** y llama a `permiso.pedir()`.
- El campo que decide es **`canAskAgain`** (junto con `denied`). En
  `mapearRespuesta` (`src/lib/permisos.ts`), `denied` + `canAskAgain: false` se traduce
  a **bloqueado**. En Android se complementa con el flag local para no confundir un
  permiso “Solo esta vez” vencido.

### 2. “Revocá la cámara desde Ajustes con la app abierta y volvé. ¿Qué hace Android con la app? ¿Cómo se entera tu código?”

- Android **mata el proceso** de la app cuando se revoca un permiso de runtime.
- Al volver, la app arranca de nuevo. El hook **`useRevisarAlVolver`**
  (`src/hooks/useRevisarAlVolver.ts`) escucha `AppState`; cuando pasa a `active`, llama a
  `refrescar()`.
- `usePermiso` vuelve a llamar a `get…PermissionsAsync()` y actualiza el estado. El panel
  y las pantallas se re-renderizan.
- Además, el panel refresca al enfocar la pestaña (`useFocusEffect`).

### 3. “¿Por qué tu app no pide permiso para elegir una foto, pero sí para sacarla?”

- Elegir una foto usa **`ImagePicker.launchImageLibraryAsync`**, que abre el **selector
  del sistema** (Photo Picker). El sistema le da a la app solo la foto elegida, sin
  acceso al resto del álbum. Por eso **no** se llama a
  `requestMediaLibraryPermissionsAsync`.
- Sacar una foto usa la **cámara** (`CameraView` + `takePictureAsync`), que es un sensor
  protegido: necesita el permiso **CAMERA**.
- Archivos: `src/app/reporte/foto.tsx` y `src/lib/permisos.ts`.

### 4. “¿Qué cambia en la app si la persona elige ubicación aproximada? ¿Y si la deniega?”

- La respuesta trae `android.accuracy === 'coarse'` o `ios.accuracy === 'reduced'`.
- `src/app/reporte/ubicacion.tsx` guarda `aproximada: true` y la UI muestra **“Ubicación
  aproximada”**; **no muestra coordenadas exactas**.
- Si deniega, el reporte se guarda igual con el **sector elegido a mano** (Patio,
  Estacionamiento, Pasillo, Aula, Baño, Biblioteca).

### 5. “¿Por qué tus textos de propósito no aparecían en Expo Go?”

- Porque **Expo Go es una app ya compilada** con su propio `Info.plist` y manifiesto.
- Los textos y permisos de `app.json` solo se aplican al generar **tu** binario
  (development build).
- Por eso la captura del diálogo real se hizo en una development build. En Android el
  texto propio no aparece igual (el sistema no lo permite); en iOS sí aparecería.

### 6. “Si mañana agregás la nota de voz, ¿alcanza con una OTA? ¿Por qué?”

- **No.** `expo-audio` es un módulo **nativo** y hay que declarar `RECORD_AUDIO` en el
  manifiesto (y el texto de micrófono en iOS).
- Una OTA solo actualiza JavaScript y assets; no cambia el binario ni los permisos
  nativos.
- Habría que desbloquear `RECORD_AUDIO`, agregar el plugin de `expo-audio`, hacer una
  **nueva development build** y pedir el permiso solo al tocar “Grabar nota”.

---

## 10. Preguntas probables del profesor (con respuestas)

### Expo, Router y tabs

**¿Qué es Expo?**
> Un conjunto de herramientas y módulos sobre React Native que facilita el desarrollo:
> cámara, ubicación, notificaciones, builds en la nube, etc. No es lo mismo que React
> Native puro.

**¿Qué es Expo Go?**
> Una app genérica para probar proyectos Expo sin compilar. Sirve para el día a día,
> pero no aplica los textos de propósito ni los permisos bloqueados del proyecto.

**¿Qué es una development build?**
> Un APK propio de la app, compilado con su configuración nativa. Ahí sí se ven los
> textos de propósito (en iOS), los permisos bloqueados y los módulos nativos.

**¿Qué es Expo Router?**
> El sistema de navegación basado en archivos. Cada archivo en `src/app` es una ruta y
> los `_layout.tsx` definen los navegadores. Está construido sobre React Navigation.

**¿Qué diferencia hay entre Stack y Tabs?**
> Stack apila pantallas y tiene botón de volver; Tabs cambia entre secciones desde una
> barra inferior. En mi app el Stack raíz envuelve a las tabs y a las pantallas de flujo.

**¿Qué es `(tabs)`?**
> Un grupo de rutas. Los paréntesis hacen que la carpeta no aparezca en la URL; sirve
> para darle un layout propio a las tres pestañas.

**¿Qué es `_layout.tsx`?**
> El archivo que define el navegador de una carpeta. No es una pantalla; envuelve a las
> rutas hijas.

**¿Por qué no usaste `NativeTabs`?**
> Porque `Tabs` de Expo Router me da un único layout, sin variantes web/nativas, y es
> suficiente para tres pestañas. `NativeTabs` agrega complejidad y archivos por
> plataforma que no necesitaba.

**¿Cómo pasás datos entre pantallas?**
> Con parámetros de ruta (`useLocalSearchParams`) o con contexto. Para el formulario uso
> `BorradorProvider`; para los reportes, `ReportesProvider`.

**¿Por qué usaste Context y no Redux?**
> Porque el estado es chico y local: reportes, avisos y preferencia. Context alcanza y no
> agrega dependencias.

### Código y estructura

**¿Dónde está la lógica de permisos?**
> En `src/lib/permisos.ts` (registro, textos, mapeo de estados, rutas de Ajustes) y en
> `src/hooks/usePermiso.ts` (consulta, pide, refresca).

**¿Dónde se guardan los reportes?**
> En `src/lib/reportes.tsx` (estado en memoria) y `src/lib/almacen.ts` (persistencia en
> `expo-sqlite/kv-store`).

**¿Cómo se guarda la foto?**
> Se guarda la URI local que devuelve la cámara o el selector dentro del reporte. No se
> sube a ningún servidor.

**¿Cómo se valida el formulario?**
> En `src/app/reporte/nuevo.tsx`: título, descripción y aula son obligatorios; si falta
> algo, muestra un mensaje y no crea el reporte.

**¿Qué pasa si el id no existe?**
> En `src/app/reporte/[id].tsx`, `obtenerReporte(id)` devuelve `undefined` y se muestra
> “Reporte no encontrado”.

**¿Cómo se borra un reporte?**
> `eliminarReporte(id)` en `ReportesProvider` quita el reporte y sus avisos. En el
> detalle hay un botón con confirmación; en ajustes, “Borrar todos”.

**¿Qué es el borrador?**
> Un contexto (`BorradorProvider`) que guarda los datos del formulario mientras el
> usuario va a escanear, sacar una foto o marcar la ubicación, para no perder lo escrito.

### Permisos

**¿Qué diferencia hay entre declarar y solicitar?**
> Declarar es anotar el permiso en el manifiesto/Info.plist en tiempo de compilación;
> solicitar es llamar a la API en tiempo de ejecución para que aparezca el diálogo.

**¿Qué pasa si la app pide un permiso que no está declarado?**
> En Android falla (no hay diálogo; puede lanzar `SecurityException`). En iOS la app se
> cierra al usar la API y la build se rechaza.

**¿Cuáles son los cuatro estados?**
> Cargando, concedido, preguntable y bloqueado.

**¿Qué campos deciden casi todo?**
> `granted` (¿hay acceso?) y `canAskAgain` (¿se puede volver a preguntar?).

**¿Qué hace `get…PermissionsAsync()` vs `request…PermissionsAsync()`?**
> `get` solo consulta, sin diálogo. `request` pide y puede mostrar el diálogo si
> corresponde.

**¿Qué pasa si `canAskAgain` es `false`?**
> No se puede volver a mostrar el diálogo; hay que abrir Ajustes. En Android, además,
> puede ser un permiso “Solo esta vez” vencido; por eso el flag local.

**¿Qué pasa en Android con “Solo esta vez”?**
> El permiso dura la sesión/el uso y después se revoca. La app lo muestra como
> **Preguntable** y permite volver a pedirlo; no como bloqueado.

**¿Qué hace Android al revocar un permiso con la app abierta?**
> Mata el proceso. Al volver, la app reconsulta con `AppState`/`useRevisarAlVolver`.

**¿Por qué no pedís ubicación en segundo plano?**
> Porque la función no la necesita: solo marcamos dónde está el desperfecto mientras se
> usa la app. Además, Google Play exige justificar `ACCESS_BACKGROUND_LOCATION`.

**¿Por qué bloqueaste RECORD_AUDIO?**
> Porque la app no graba audio. Solo usa la cámara para QR y fotos; el micrófono sería un
> privilegio innecesario.

**¿Por qué no pedís READ_MEDIA_IMAGES?**
> Porque usamos el selector del sistema, que solo comparte la foto elegida. No necesitamos
> acceso a toda la galería.

**¿Qué es el texto de propósito?**
> La frase que iOS muestra dentro del diálogo para explicar para qué se usa un dato. Está
> en el `Info.plist` y se configura en `app.json`. Android no permite texto propio.

### Notificaciones y avisos

**¿Qué diferencia hay entre notificación y aviso?**
> La notificación es la del sistema (bandeja de Android); el aviso es el registro dentro
> de la app, en `/avisos`. El aviso se crea siempre; la notificación es opcional.

**¿Dónde se crea el canal de notificaciones?**
> En `src/lib/notificaciones.ts`, `crearCanalReportes()`. Se llama antes de pedir el
> permiso porque Android 13+ no muestra el diálogo hasta que existe un canal.

**¿Cómo se programa la notificación a 10 segundos?**
> `programarAvisoResolucion()` usa `Notifications.scheduleNotificationAsync` con un
> trigger `TIME_INTERVAL` de 10 segundos y el canal `reportes`.

**¿Qué pasa si el permiso de notificaciones está denegado?**
> No se programa la notificación, pero el aviso se agrega igual a `/avisos`. La app lo
> informa en pantalla. Lo mismo pasa si el interruptor de avisos está apagado: el aviso
> queda en la bandeja, pero no se envía la notificación local.

**¿Por qué no usaste push?**
> Porque no hay backend ni credenciales FCM/APNs. El TP pide una notificación local de
> prueba; push sería otro alcance.

### Datos y configuración

**¿Dónde se guardan los datos?**
> En el teléfono, con `expo-sqlite/kv-store`, bajo la clave `mantenimiento-ipf:v1`. Es un
> JSON con reportes, avisos y la preferencia de avisos.

**¿Qué pasa si desinstalás la app?**
> Se pierden los datos, porque no hay backend.

**¿Qué es `app.json`?**
> La configuración de Expo: nombre, package, plugins, permisos bloqueados, textos de
> propósito, `typedRoutes` y `reactCompiler`.

**¿Qué es un config plugin?**
> Una función que modifica los archivos nativos durante el prebuild a partir de la
> configuración de `app.json`. Por eso no editamos `android/` a mano.

**¿Qué es `expo prebuild`?**
> Genera `android/` e `ios/` desde `app.json`. Esas carpetas están gitignoreadas y se
> regeneran en cada build (CNG).

**¿Qué es `eas.json`?**
> Los perfiles de EAS Build. El perfil `development` genera un APK con
> `expo-dev-client` para probar la configuración nativa.

**¿Qué es una OTA?**
> Una actualización solo de JavaScript/assets. No cambia permisos, módulos nativos ni
> `Info.plist`; para eso hace falta una build nueva.

### Pruebas y entrega

**¿Cómo probaste la app?**
> En Android, con Expo Go para el desarrollo y una development build para la
> configuración nativa. iOS no se probó.

**¿Qué comandos usaste?**
> `npx expo start`, `npx expo start --dev-client`, `npx tsc --noEmit`,
> `npx expo-doctor` y `npx eas-cli@latest build -p android --profile development`.
> En Windows, con `npx.cmd` por la política de scripts.

**¿Dónde están las capturas y el video?**
> En `docs/capturas/` y `docs/video/demo-mantenimiento-ipf.mp4`. El README explica qué
> muestra cada una y aclara la limitación de Android con el texto de propósito.

---

## 11. Guion de demo (3 minutos)

1. **Inicio**: “Estas son las tres tabs: Reportes, Avisos y Permisos. La app arranca
   vacía; los reportes se guardan localmente.”
2. **Nuevo reporte**: completar título, descripción, aula y categoría. Mencionar que no
   se pide ningún permiso al abrir el formulario.
3. **Escanear**: tocar “Escanear QR”, mostrar la pantalla previa con el beneficio,
   “Continuar”, el diálogo del sistema y la cámara. Si no hay cámara, escribir el aula a
   mano.
4. **Foto**: “Elegir de la galería” y aclarar que **no** aparece diálogo de permisos
   porque es el selector del sistema.
5. **Ubicación**: “Usar mi ubicación”, aceptar; si se elige aproximada, la app no muestra
   coordenadas. Después denegar y elegir un sector a mano.
6. **Guardar** y mostrar el detalle.
7. **Simular resolución**: explicar que se agrega el aviso y, si el interruptor está
   activo y hay permiso, la notificación local a los 10 s.
8. **Avisos**: mostrar la bandeja y el badge de no leídos.
9. **Permisos**: mostrar los estados; ir a Ajustes, cambiar uno, volver y mostrar que se
   actualiza solo.
10. **Cierre**: “Ningún permiso denegado impide cargar el reporte: siempre hay una
    alternativa.”

---

## 12. Si no sabés qué responder

No digas “no sé”. Decí algo así:

- “Eso no lo implementé en este TP; si lo tuviera que agregar, iría en
  `src/lib/…` usando el módulo `expo-…`.”
- “No recuerdo el nombre exacto del método, pero la lógica está en
  `src/hooks/usePermiso.ts`: consulta, pide y vuelve a consultar.”
- “La decisión la toma el sistema; la app solo declara, pide y reacciona.”
- “En Android el diálogo es del sistema; el texto propio es de iOS.”
- “La app no se bloquea si falta un permiso: cada función tiene su alternativa.”
- “Eso es configuración nativa: va en `app.json` y requiere una build nueva, no una OTA.”

---

## 13. Chuleta final (10 ideas)

1. **Expo Router = rutas por archivos**. Cada archivo en `src/app` es una ruta.
2. **`_layout.tsx` = navegador**, no pantalla. El raíz es Stack; `(tabs)` es Tabs.
3. **Tabs = barra inferior** con Reportes, Avisos y Permisos.
4. **`(tabs)` = grupo** que no aparece en la URL; `[id]` = ruta dinámica.
5. **Declarar ≠ solicitar**: `app.json` declara; `request…()` pide en runtime.
6. **Cuatro estados**: cargando, concedido, preguntable, bloqueado.
7. **`granted` + `canAskAgain`** deciden casi todo.
8. **Avisos**: se muestran en `src/app/(tabs)/avisos.tsx`; se crean en
   `resolverReporte()` de `src/lib/reportes.tsx`; el badge está en
   `(tabs)/_layout.tsx`.
9. **Galería sin permiso**: `launchImageLibraryAsync` + selector del sistema; cámara sí
   necesita permiso.
10. **Expo Go ≠ development build**: la config nativa (textos, permisos bloqueados) solo
    se aplica en la build propia.

---

## 14. Comandos y datos útiles

```powershell
# desarrollo diario
npx.cmd expo start

# development build (la app ya instalada)
npx.cmd expo start --dev-client

# verificación
npx.cmd tsc --noEmit
npx.cmd expo-doctor

# build en la nube
npx.cmd eas-cli@latest build -p android --profile development
```

Datos del proyecto:

- Expo SDK **57**, React Native **0.86.3**, React **19.2.3**, TypeScript **6**.
- Package Android: `com.ipf.mantenimiento`.
- Almacenamiento: `expo-sqlite/kv-store`, clave `mantenimiento-ipf:v1`.
- Canal de notificaciones: `reportes`.
- Rutas: `/`, `/avisos`, `/permisos`, `/permisos/[recurso]`, `/reporte/nuevo`,
  `/reporte/escanear`, `/reporte/foto`, `/reporte/ubicacion`, `/reporte/[id]`,
  `/ajustes-app`.
