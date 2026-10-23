# RESPUESTAS — TP3: Permisos móviles (Android, iOS y Expo)

> Respuestas de las Partes A a F del Trabajo Práctico N° 3.
> Proyecto: **Mantenimiento IPF** (Expo SDK 57, Expo Router, TypeScript).

---

# Parte A · ¿Qué es un permiso y por qué existe?

## A1. Conceptos

**a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?**

Un permiso es una autorización explícita que el sistema operativo exige antes de que
una app acceda a un recurso o dato protegido (cámara, micrófono, ubicación, fotos,
contactos, notificaciones, etc.). No es algo que la app se da a sí misma: la app lo
declara y lo solicita, el sistema operativo aplica la política y muestra el diálogo, y
la persona usuaria decide si lo concede o lo niega. Además, la persona puede cambiar
esa decisión en cualquier momento desde Ajustes.

**b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?**

El sandbox es el aislamiento con el que el sistema encierra a cada app: cada una tiene
su propio espacio de almacenamiento privado, su memoria y sus recursos, y no puede leer
los datos de otras apps ni tocar hardware sensible sin autorización. Los permisos son
justamente las puertas controladas que atraviesan ese aislamiento.

Sin ningún permiso, una app igual puede: ejecutarse, dibujar su interfaz, hacer
cálculos, guardar datos en su almacenamiento privado, mostrar contenido propio y usar
la red (en Android `INTERNET` es un permiso “normal” que se concede al instalar). Lo
que no puede es acceder a la cámara, el micrófono, la ubicación, los contactos, la
galería compartida, las notificaciones (en versiones nuevas) ni los archivos de otras
apps.

**c) Cuatro razones por las que existen los permisos, con un ejemplo de cada una.**

1. **Privacidad**: evitar que una app espíe o capture datos sin consentimiento. Ejemplo:
   la cámara y el micrófono.
2. **Seguridad**: impedir el robo o la manipulación de información sensible. Ejemplo:
   contactos, SMS o el almacenamiento compartido.
3. **Control y consentimiento de la persona**: que decida cuándo y para qué se usa su
   información, y que pueda revocarlo. Ejemplo: la ubicación o las notificaciones.
4. **Uso razonable de recursos y cumplimiento**: evitar abusos de batería o
   interrupciones y cumplir políticas de las tiendas y leyes de datos. Ejemplo:
   ubicación en segundo plano, alarmas exactas, rastreo entre apps (ATT).

**d) En la analogía del portero del edificio, ¿quién es la visita, quién el portero y quién el dueño del departamento? ¿Qué significa que “el portero se acuerda de la respuesta”?**

- **Visita**: la app que quiere entrar a un recurso.
- **Portero**: el sistema operativo, que controla el acceso y pide autorización.
- **Dueño del departamento**: la persona usuaria, que decide.

Que “el portero se acuerda” significa que el sistema **persiste la decisión**: una vez
que la persona concede o niega, no se le vuelve a preguntar en cada uso. Por eso la app
debe **consultar** el estado (`get…PermissionsAsync()`) y, si está bloqueado, ofrecer
abrir Ajustes en lugar de insistir con el diálogo.

## A2. Declarar y solicitar

|  | Declarar (al compilar) | Solicitar (al ejecutar) |
| --- | --- | --- |
| **¿Qué se hace?** | Se deja constancia en la configuración nativa de que la app podría necesitar ese permiso. | Se llama a la API del sistema en el momento de uso para que muestre el diálogo (si corresponde). |
| **¿Dónde / cómo en Android?** | `<uses-permission android:name="android.permission.CAMERA" />` en `AndroidManifest.xml`. En Expo se genera desde `app.json` y los config plugins. | `ActivityCompat.requestPermissions(...)` / `requestPermission(...)`; con Expo, `requestCameraPermissionsAsync()` o el hook `useCameraPermissions()`. |
| **¿Dónde / cómo en iOS?** | Clave de uso en `Info.plist`, por ejemplo `NSCameraUsageDescription`. En Expo, `ios.infoPlist` o la opción del plugin. | APIs de Apple (AVFoundation, CoreLocation, etc.). Con Expo, `requestCameraPermissionsAsync()`, `requestForegroundPermissionsAsync()`, etc. |
| **¿Dónde / cómo en Expo?** | `app.json` → `plugins` con sus opciones, `android.permissions`, `android.blockedPermissions`, `ios.infoPlist`. `npx expo prebuild` genera los archivos nativos. | Hooks `useCameraPermissions`, `useForegroundPermissions`, `useMediaLibraryPermissions` o las funciones `request…PermissionsAsync()`. |
| **¿Qué pasa si se omite?** | **Android**: la solicitud falla (la app no puede pedir un permiso no declarado) y puede lanzar `SecurityException`; no aparece el diálogo. **iOS**: la app se cierra al tocar la API protegida y la build se rechaza en App Store Connect. | La app nunca obtiene el acceso. En Android 6+ tener el permiso declarado no alcanza: hay que pedirlo en runtime. En iOS, sin solicitud no hay concesión. |

## A3. Verdadero o falso

| # | Afirmación | V/F | Justificación |
| --- | --- | --- | --- |
| a | El diálogo de permiso lo dibuja tu app con componentes de React Native. | **F** | Lo dibuja el sistema operativo. La app solo puede mostrar una pantalla previa propia, pero el diálogo real es del SO. |
| b | En Expo, la fuente de verdad de los permisos es `app.json`, no el `AndroidManifest.xml`. | **V** | Con CNG, `app.json` (y los plugins) genera el manifiesto y el `Info.plist` en cada prebuild/build. Editar el nativo a mano se pierde. |
| c | Agregar un permiso nuevo en el `Info.plist` se puede publicar con una actualización OTA. | **F** | `Info.plist` es configuración nativa: exige una nueva build binaria. Las OTA solo actualizan JavaScript y assets. |
| d | Si tu código pide un permiso que no está en el manifiesto, Android igual muestra el diálogo. | **F** | Android exige declararlo; si no está, la solicitud falla (no hay diálogo) y puede lanzar `SecurityException`. |
| e | El paquete `expo-permissions` es la forma recomendada de pedir permisos en SDK 57. | **F** | Está deprecado y eliminado. Cada módulo expone su propio permiso (`expo-camera`, `expo-location`, `expo-notifications`, etc.). |
| f | En iOS, las notificaciones no llevan texto de propósito en el `Info.plist`. | **V** | No existe una clave `NS…UsageDescription` para notificaciones; el diálogo lo arma el sistema sin texto propio. |
| g | Con acceso limitado a fotos, `status` vale `'granted'` y el matiz está en `accessPrivileges`. | **V** | Expo devuelve `status: 'granted'` y `accessPrivileges: 'limited'` (iOS 14+; Android 14+ con acceso parcial). |
| h | Desinstalar y reinstalar la app es la forma confiable de volver a “sin decidir” en las dos plataformas. | **F** | Funciona, pero no es la única ni la más práctica. En Android se puede usar `adb shell pm clear` o restablecer permisos de la app; en el simulador de iOS `xcrun simctl privacy booted reset …`. En un iOS físico, en cambio, la vía práctica es reinstalar. |

## A4. Los estados de un permiso

**Diagrama Android (API 23+):**

```
Sin decidir ──pedir──> Concedido
     │                    ▲
     └──pedir──> Denegado ─┘ (la persona puede conceder desde Ajustes)
                    │
             pedir otra vez
                    │
        (Android 11+: 2.º rechazo)
                    ▼
                Bloqueado ──> solo Ajustes
```

Además, Android 11+ ofrece **“Solo esta vez”** para ubicación, micrófono y cámara: el
permiso se revoca cuando se cierra la app (o tras un tiempo de inactividad).

**Diagrama iOS:**

```
No determinado ──pedir (una única vez)──> Concedido (En uso / Siempre / Una vez)
       │                                        │
       └──────────────> Denegado <──────────────┘
                            │
                     solo Ajustes
```

La diferencia central: **Android puede volver a mostrar el diálogo mientras
`canAskAgain` sea `true`; iOS muestra el diálogo una sola vez por permiso**. Después de
un “No permitir” en iOS, la app solo puede llevar a la persona a Ajustes.

**Qué devuelve Expo:**

| Estado | `status` | `canAskAgain` | ¿Puede aparecer el diálogo? |
| --- | --- | --- | --- |
| Sin decidir | `undetermined` | `true` | Sí |
| Concedido | `granted` | `false` (irrelevante: ya hay acceso) | No hace falta |
| Denegado (se puede volver a pedir) | `denied` | `true` | Sí |
| Bloqueado | `denied` | `false` | No: solo Ajustes |

> En la app, la decisión se toma con **`granted`** y **`canAskAgain`**, no con `status`
> a secas. `status` dice cuál es la decisión; `canAskAgain` dice si todavía se puede
> insistir.

---

# Parte B · Android: tipos de permisos y manifiesto

## B1. Clasificá los permisos

| Permiso | Tipo | ¿Cómo se obtiene? |
| --- | --- | --- |
| `INTERNET` | De instalación (normal) | Se concede al instalar; no hay diálogo. |
| `CAMERA` | De tiempo de ejecución (peligroso) | Diálogo del sistema al pedirlo con `requestCameraPermissionsAsync()`. |
| `VIBRATE` | De instalación (normal) | Se concede al instalar. |
| `SYSTEM_ALERT_WINDOW` | Especial | Ajustes → “Mostrar sobre otras apps” (intent `ACTION_MANAGE_OVERLAY_PERMISSION`). |
| `POST_NOTIFICATIONS` | De tiempo de ejecución (Android 13+) | Diálogo del sistema; requiere un canal creado antes. |
| `ACCESS_NETWORK_STATE` | De instalación (normal) | Se concede al instalar. |
| `READ_CONTACTS` | De tiempo de ejecución (peligroso) | Diálogo del sistema. |
| `SCHEDULE_EXACT_ALARM` | Especial (Android 12+) | Ajustes → “Alarmas y recordatorios” (`ACTION_REQUEST_SCHEDULE_EXACT_ALARM`). |
| `RECORD_AUDIO` | De tiempo de ejecución (peligroso) | Diálogo del sistema. |
| `MANAGE_EXTERNAL_STORAGE` | Especial (“All files access”) | Ajustes, con pantalla especial; Google Play lo restringe y exige justificación. |

## B2. Grupos y nombres

**a) ¿Qué es un grupo de permisos? Si la app pide `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos, ¿cuántos diálogos ve la persona?**

Un grupo de permisos es una agrupación lógica de permisos peligrosos relacionados
(ubicación, cámara, contactos, etc.). El sistema agrupa los diálogos para no pedir uno
por cada permiso. Como `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` pertenecen al
grupo de ubicación, la persona ve **un solo diálogo**, donde desde Android 12 puede
elegir entre ubicación precisa y aproximada.

**b) ¿Qué prefijo lleva el nombre completo de un permiso? Escribí el nombre completo del permiso de cámara.**

El prefijo es `android.permission.`. El permiso de cámara es
**`android.permission.CAMERA`**.

**c) ¿Qué son los permisos de firma (signature)? ¿Por qué no se usan en apps comunes?**

Son permisos que el sistema concede únicamente a apps firmadas con **la misma clave**
que la app que los declara (o al propio sistema/fabricante). No se pueden obtener con
un diálogo. Se usan para integraciones internas, apps del sistema o suites del mismo
desarrollador. Una app común no puede pedirlos: no se los van a conceder, y Google Play
los cuestiona.

## B3. Leé el manifiesto

**a) ¿Qué permisos se conceden solos al instalar y cuáles hay que pedir además en tiempo de ejecución?**

- **Solos al instalar**: `INTERNET` y `ACCESS_NETWORK_STATE` (permisos normales).
- **En tiempo de ejecución**: `CAMERA`, `ACCESS_COARSE_LOCATION`,
  `ACCESS_FINE_LOCATION`, `POST_NOTIFICATIONS` (Android 13+) y
  `READ_EXTERNAL_STORAGE` en Android ≤ 12 (en 13+ ya no aplica).
- `RECORD_AUDIO` figura con `tools:node="remove"`, así que no queda en el manifiesto.

**b) ¿Qué significa `android:maxSdkVersion="32"`? ¿Qué permisos reemplazan a `READ_EXTERNAL_STORAGE` desde Android 13?**

Significa que el permiso solo se declara/aplica hasta Android 12L (API 32). Desde
Android 13 (API 33) se reemplaza por permisos granulares de medios:
**`READ_MEDIA_IMAGES`**, **`READ_MEDIA_VIDEO`** y **`READ_MEDIA_AUDIO`**. En Android 14
(API 34) además existe el acceso parcial con `READ_MEDIA_VISUAL_USER_SELECTED`.

**c) ¿Qué hace `tools:node="remove"`? Escribí el fragmento de `app.json` que lo genera.**

Elimina el permiso del manifiesto **fusionado**, aunque una librería lo declare en su
propio manifiesto. En Expo se genera con `android.blockedPermissions`:

```json
{
  "expo": {
    "android": {
      "blockedPermissions": ["android.permission.RECORD_AUDIO"]
    }
  }
}
```

**d) Necesitás agregar `SCHEDULE_EXACT_ALARM`, que ninguna librería declara. ¿En qué propiedad de `app.json` va?**

En `expo.android.permissions`, como array de nombres completos:

```json
{
  "expo": {
    "android": {
      "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
    }
  }
}
```

**e) ¿Por qué en Expo no conviene editar este archivo a mano? ¿Funciona `blockedPermissions` en Expo Go?**

Porque `AndroidManifest.xml` se **regenera** en cada `expo prebuild` o build (CNG): los
cambios manuales se pierden. La fuente de verdad es `app.json` + los config plugins.
`blockedPermissions` **no funciona en Expo Go**, porque Expo Go es una app ya compilada
con su propio manifiesto; solo tiene efecto en development builds y apps standalone.

## B4. Así pregunta Android

**a) ¿Se puede poner texto propio dentro del diálogo de Android? Entonces, ¿dónde tenés que explicar para qué usás el permiso?**

No. Android no permite personalizar el texto del diálogo: muestra el nombre de la app y
el grupo de permisos. Por eso hay que explicar el beneficio **antes**, con una pantalla
previa propia o en la interfaz, en el momento en que la persona toca la función.

**b) ¿Qué diferencia hay entre “Mientras la app está en uso” y “Solo esta vez”? ¿Para qué permisos existe esta última opción?**

- **Mientras la app está en uso**: el acceso dura mientras la app está en primer plano
  (o en uso).
- **Solo esta vez**: es temporal; se revoca al cerrar la app o después de un tiempo de
  inactividad.

“Solo esta vez” existe para ubicación, micrófono y cámara (Android 11+), pensada para
usos puntuales.

**c) En Android 11+, ¿qué pasa si la persona toca “No permitir” dos veces? ¿Qué valor toma `canAskAgain`?**

El sistema interpreta el segundo rechazo como **“no volver a preguntar”**: el permiso
queda bloqueado y la app ya no puede mostrar el diálogo. `canAskAgain` pasa a
**`false`**. La única vía es abrir Ajustes.

**d) La ubicación aproximada tiene una precisión de unos 3 km². Da un ejemplo de función que anda bien con ella y otro de una que no.**

- **Anda bien**: mostrar las farmacias de turno o los puntos de reciclaje del barrio,
  el clima local o noticias de la zona.
- **No anda bien**: navegación paso a paso, registrar el recorrido de una carrera,
  geofencing fino o indicar la puerta exacta del aula.

**e) Si la persona revoca un permiso desde Ajustes mientras la app está abierta, ¿qué hace Android con el proceso de la app?**

Android **mata el proceso** de la app. Al reabrirla arranca de cero y debe volver a
consultar los permisos. Por eso no hay que confiar en un estado guardado en memoria ni
en un store global “para siempre”.

## B5. Android, versión por versión

| Cambio | Versión (API) | Qué implica para el código |
| --- | --- | --- |
| Nacen los permisos en tiempo de ejecución | Android 6.0 (API 23) | Hay que declarar **y** pedir en runtime; no alcanza con el manifiesto. |
| La ubicación en segundo plano pasa a ser un permiso aparte | Android 10 (API 29) | `ACCESS_BACKGROUND_LOCATION` se pide después del permiso en primer plano y con justificación. |
| Dos rechazos equivalen a “no volver a preguntar” | Android 11 (API 30) | Hay que manejar `canAskAgain === false` y ofrecer Ajustes. |
| Ubicación precisa o aproximada | Android 12 (API 31) | La respuesta trae `android.accuracy` (`fine`/`coarse`); la UI debe adaptarse. |
| Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`) | Android 13 (API 33) | Pedir el permiso y crear antes un canal con `setNotificationChannelAsync`. |
| Acceso parcial a fotos y videos (“Seleccionar fotos”) | Android 14 (API 34) | `READ_MEDIA_VISUAL_USER_SELECTED`; los permisos granulares `READ_MEDIA_*` son de API 33. |
| Permiso de red local (`ACCESS_LOCAL_NETWORK`) | Android 17 (API 37) | Se declara/pide para descubrir o conectar dispositivos en la red local, según el material de la cátedra. |

**¿Qué es el `targetSdkVersion`? ¿A qué API apunta Expo SDK 57 y qué exige Google Play desde el 31 de agosto de 2026?**

`targetSdkVersion` es la versión de API con la que la app declara que fue probada y a la
que se le aplican los comportamientos del sistema (no es lo mismo que
`compileSdkVersion`, que es con la que se compila). **Expo SDK 57 apunta a API 36
(Android 16)**, con `compileSdkVersion` 36. Google Play exige desde el **31/08/2026**
que las apps nuevas y las actualizaciones apunten a **API 36**.

---

# Parte C · iOS: textos de propósito y acceso parcial

## C1. Claves del `Info.plist`

| Recurso | Clave en `Info.plist` |
| --- | --- |
| Cámara | `NSCameraUsageDescription` |
| Micrófono | `NSMicrophoneUsageDescription` |
| Ubicación en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicación siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` (la `NSLocationAlwaysUsageDescription` está deprecada) |
| Fotos (leer) | `NSPhotoLibraryUsageDescription` |
| Fotos (solo guardar) | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps (ATT) | `NSUserTrackingUsageDescription` |
| Notificaciones | **No lleva clave** (no existe texto de propósito para notificaciones) |

## C2. Sin texto, no hay permiso

**a) ¿Qué pasa si falta el texto de propósito y la app intenta usar la cámara? ¿Y al subir la build a App Store Connect? Mencioná el código de error.**

Al llamar a la API protegida, **iOS cierra la app** con el error:
“This app has crashed because it attempted to access privacy-sensitive data without a
usage description”. Al subir la build, App Store Connect la rechaza con el aviso
**ITMS-90683: Missing purpose string in Info.plist** (y en revisión se rechaza por la
pauta 5.1.1).

**b) ¿Cuántas veces muestra iOS el diálogo de un permiso? Si la persona dice que no, ¿qué le queda a la app?**

Lo muestra **una sola vez** por permiso (salvo el caso especial de “Permitir una vez”,
que se puede volver a pedir en una sesión nueva). Si la persona dice que no, a la app
solo le queda explicar y ofrecer **Abrir Ajustes**; no puede volver a disparar el
diálogo.

**c) En el diálogo de iOS, ¿qué parte arma el sistema y cuál escribís vos? En Expo, ¿dónde se configura ese texto?**

El sistema arma el título, los botones y el diseño. Vos escribís el **texto de
propósito** (`NS…UsageDescription`), que aparece debajo del título. En Expo se configura
en `app.json`: opciones de los plugins (`cameraPermission`, `photosPermission`,
`locationWhenInUsePermission`, etc.) o directamente en `ios.infoPlist`. Requiere una
nueva build para tomar efecto.

**d) Una librería usa una API protegida que tu app nunca llama y Apple rechaza la build. ¿Por qué pasa y cómo se resuelve?**

Porque Apple revisa las **APIs protegidas enlazadas** por el binario y los SDK de
terceros, no solo las que tu código llama. Si una librería enlaza contactos, fotos o
sensores, la app necesita la clave de propósito correspondiente. Se resuelve agregando
la clave (en Expo, con el plugin o `ios.infoPlist`) y recompilando, o quitando la
librería si no se usa. No se arregla con una actualización OTA.

## C3. Probador de textos de propósito

| Texto propuesto | ¿Aprobado? | Versión mejorada |
| --- | --- | --- |
| “Necesitamos tu ubicación.” | **No** | “Usamos tu ubicación para marcar el sector del edificio donde está el desperfecto.” |
| “Para mejorar tu experiencia.” | **No** | “Usamos tu ubicación para mostrarte los puntos de reciclaje más cercanos a tu barrio.” |
| “Usamos tu ubicación para mostrarte las farmacias de turno más cercanas.” | **Sí** | — (cumple el molde: dato + beneficio concreto) |
| “La app no funciona sin ubicación.” | **No** | “Usamos tu ubicación para ordenar los resultados por cercanía; si la denegás, podés elegir una zona a mano.” |
| “Ubicación requerida por el sistema.” | **No** | “Usamos tu ubicación para registrar el recorrido de la carrera mientras la app está en uso.” |

Criterio: el texto tiene que decir **qué dato** se usa y **para qué beneficio concreto**;
no puede ser genérico, falso ni una amenaza.

## C4. Acceso parcial y gradual

| Caso iOS | Desde | En Expo |
| --- | --- | --- |
| Fotos limitadas (“Seleccionar fotos”) | iOS 14 | `accessPrivileges: 'limited'` en la respuesta de permisos de fotos (`ImagePicker`/`MediaLibrary`). |
| Ubicación aproximada (interruptor “Precisa”) | iOS 14 | `LocationPermissionResponse.ios.accuracy === 'reduced'`. |
| “Permitir una vez” (ubicación) | iOS 13 | No se puede distinguir de “Al usar la app”: ambas devuelven `scope: 'whenInUse'` y se revoca al cerrar la app. |
| Ubicación escalonada: de “al usar la app” a “Siempre” | iOS 13 | Primero `requestForegroundPermissionsAsync()`; después `requestBackgroundPermissionsAsync()`. |
| Notificaciones provisionales | iOS 12 | `requestPermissionsAsync({ ios: { allowProvisional: true } })`; se detecta con `ios.status === IosAuthorizationStatus.PROVISIONAL`. |
| Rastreo entre apps (ATT) | iOS 14.5 | `expo-tracking-transparency`: `requestTrackingPermissionsAsync()` + `NSUserTrackingUsageDescription`. |

**¿Qué versión mínima de iOS requiere Expo SDK 57? ¿Qué consecuencia práctica tiene eso sobre la tabla anterior?**

Expo SDK 57 requiere **iOS 16.4 o superior**. Consecuencia: **todas las funciones de
la tabla están disponibles** en la versión mínima (iOS 14, 14.5 y 12 son anteriores), así
que no hacen falta ramas de compatibilidad para versiones viejas ni degradaciones por
debajo de iOS 16.4.

## C5. Android vs iOS, lado a lado

|  | Android | iOS |
| --- | --- | --- |
| **¿Dónde se declara?** | `AndroidManifest.xml` (`<uses-permission>`), generado desde `app.json`/plugins. | `Info.plist` (claves `NS…UsageDescription`), desde plugins/`ios.infoPlist`. |
| **Texto en el diálogo** | No se puede personalizar (solo nombre de app y grupo). | Vos escribís el texto de propósito; el sistema arma el resto. |
| **Oportunidades para preguntar** | Mientras `canAskAgain` sea `true` (Android 11+: dos rechazos y se bloquea). | Una sola vez; después solo Ajustes. |
| **“Solo esta vez” / “Permitir una vez”** | “Solo esta vez” para ubicación, micrófono y cámara; se revoca al cerrar la app. | “Permitir una vez” para ubicación; dura la sesión. |
| **Notificaciones** | Permiso en tiempo de ejecución desde Android 13; requiere canal creado antes. | Sin texto de propósito; diálogo una vez; existe modo provisional. |
| **Ubicación en segundo plano** | Permiso aparte (`ACCESS_BACKGROUND_LOCATION`), se pide después del de primer plano. | “Siempre” se pide después de “Al usar la app”; el sistema decide cuándo mostrar el segundo diálogo. |
| **Si falta la declaración** | Falla la solicitud (`SecurityException`), no hay diálogo. | Crash al usar la API + rechazo de la build (`ITMS-90683`). |

---

# Parte D · Expo: una API, dos plataformas

## D1. Módulos y funciones

| Necesidad | Módulo | Hook / función de permiso |
| --- | --- | --- |
| Escanear un QR con la cámara | `expo-camera` | `useCameraPermissions()` / `requestCameraPermissionsAsync()` |
| Grabar video con sonido | `expo-camera` | `useCameraPermissions()` + `useMicrophonePermissions()` |
| Mostrar farmacias cercanas | `expo-location` | `useForegroundPermissions()` / `requestForegroundPermissionsAsync()` |
| Seguir un envío con la app en segundo plano | `expo-location` + `expo-task-manager` | `requestBackgroundPermissionsAsync()` + `startLocationUpdatesAsync()` |
| Mostrar un recordatorio | `expo-notifications` | `requestPermissionsAsync()` / `getPermissionsAsync()` |
| Grabar una nota de voz | `expo-audio` | `AudioModule.requestRecordingPermissionsAsync()` / `useAudioRecorder()` |
| Galería propia dentro de la app | `expo-media-library` | `usePermissions()` / `requestPermissionsAsync()` |
| Publicidad personalizada entre apps (iOS) | `expo-tracking-transparency` | `requestTrackingPermissionsAsync()` / `getTrackingPermissionsAsync()` |

**Un tutorial usa `import * as Permissions from 'expo-permissions'`. ¿Qué te dice eso sobre el tutorial?**

Que está desactualizado. `expo-permissions` fue deprecado y eliminado: hoy cada módulo
expone su propio permiso (`expo-camera`, `expo-location`, `expo-notifications`,
`expo-audio`, etc.) y hay que usar esas APIs.

## D2. Consultar, pedir y el hook

**a) ¿Qué diferencia hay entre `get…PermissionsAsync()` y `request…PermissionsAsync()`? ¿Cuál puede mostrar un diálogo?**

`get…` solo **consulta** el estado actual, sin efectos visibles y sin diálogo.
`request…` **solicita** el permiso y puede mostrar el diálogo del sistema, pero solo si
corresponde (sin decidir o `canAskAgain: true`). Si está bloqueado, `request…` resuelve
sin mostrar nada.

**b) El hook devuelve tres elementos. ¿Qué es cada uno? ¿Qué vale `permiso` en el primer render y qué tiene que mostrar la pantalla mientras tanto?**

Devuelve `[permiso, pedirPermiso, consultarPermiso]`: el estado actual, una función para
pedir y otra para volver a consultar. En el primer render `permiso` vale **`null`**
(la consulta es asíncrona), así que la pantalla debe mostrar un **indicador de carga** y
no asumir ni concedido ni denegado.

**c) Si `canAskAgain` es `false`, ¿qué pasa al llamar a `request…()`? ¿Qué problema aparece si se lo llama en un bucle?**

La llamada resuelve inmediatamente con el permiso denegado y **sin diálogo**. Llamarla en
un bucle es un error: no cambia el resultado, repite trabajo nativo y puede provocar
re-renders infinitos, congelar la app o agotar la batería. Hay que pedir solo ante una
acción de la persona y, si está bloqueado, abrir Ajustes.

## D3. Leé la respuesta

| Respuesta | Qué hace la app |
| --- | --- |
| `null` | Muestra “cargando…” / spinner; todavía no sabe nada. |
| `{ status: 'granted', granted: true }` | Usa el recurso normalmente. |
| `{ status: 'undetermined', canAskAgain: true }` | Muestra la explicación y pide el permiso cuando la persona toca el botón. |
| `{ status: 'denied', canAskAgain: true }` | Explica y permite reintentar ante una nueva acción; ofrece la alternativa. |
| `{ status: 'denied', canAskAgain: false }` | Bloqueado: no insiste, muestra “Abrir Ajustes”. |
| `{ status: 'granted', accessPrivileges: 'limited' }` | Usa el acceso limitado; muestra el matiz y ofrece ampliar desde Ajustes. |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Usa ubicación aproximada; **no muestra coordenadas exactas**. |

**¿Cuáles son los dos campos que deciden casi todo? ¿Qué pregunta responde cada uno?**

`status` (o `granted`) responde **“¿cuál es la decisión actual?”**. `canAskAgain`
responde **“¿puedo volver a mostrar el diálogo?”**. Juntos definen si se usa el recurso,
si se puede pedir o si hay que ir a Ajustes.

## D4. Simulación del ciclo completo

Android 14, app recién instalada, `expo-location`:

| # | Acción | `status` | `canAskAgain` | ¿Diálogo? |
| --- | --- | --- | --- | --- |
| 1 | `getForegroundPermissionsAsync()` | `undetermined` | `true` | No (solo consulta) |
| 2 | `request…()` → “No permitir” | `denied` | `true` | Sí |
| 3 | `request…()` → “No permitir” otra vez | `denied` | `false` | Sí (es el 2.º y último) |
| 4 | `request…()` de nuevo | `denied` | `false` | No |
| 5 | `Linking.openSettings()` → “Mientras la app está en uso” → volver y consultar | `granted` | `false` | No (ya hay acceso) |
| 6 | Igual que 5, pero la app no vuelve a consultar | Sigue mostrando el valor viejo (`denied`/bloqueado) | `false` | No |

El paso 6 muestra el error clásico: **sin volver a consultar al volver de Ajustes, la app
queda con estado obsoleto**. Se soluciona con `AppState`/`useFocusEffect` y
`consultarPermiso()`.

**Repetí los pasos 1 a 4 en iOS. ¿En qué paso cambia el resultado y por qué? ¿Qué pasa en iOS si la persona elige “Permitir una vez” y después cierra y reabre la app?**

En iOS el cambio aparece en el **paso 3**: después del primer “No permitir” (paso 2), el
diálogo **ya no se vuelve a mostrar**, porque iOS solo lo muestra una vez. `canAskAgain`
queda en `false` y la app solo puede ofrecer Ajustes.

Si elige **“Permitir una vez”**, el acceso vale solo para esa sesión: al cerrar y reabrir
la app, el permiso se revoca y la app vuelve a estar “sin decidir”, por lo que puede
volver a preguntar.

## D5. Configurar `app.json`

App que lee QR (sin video ni micrófono), usa ubicación solo en primer plano para puntos
de reciclaje y no debe tener `SYSTEM_ALERT_WINDOW`:

```jsonc
{
  "expo": {
    "plugins": [
      ["expo-camera", {
        "cameraPermission": "Usamos tu cámara para leer el QR del aula.",
        "microphonePermission": false,
        "recordAudioAndroid": false,
        "barcodeScannerEnabled": true
      }],
      ["expo-location", {
        "locationWhenInUsePermission": "Usamos tu ubicación para mostrar los puntos de reciclaje cercanos."
      }]
    ],
    "android": {
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW"
      ]
    }
  }
}
```

**¿Por qué `expo-camera` agrega `RECORD_AUDIO` en Android aunque la app no grabe sonido?**

Porque la librería soporta grabar video con audio y su manifiesto/plugin declara
`RECORD_AUDIO` por defecto. Si no se graba audio, hay que desactivarlo con
`microphonePermission: false` y `recordAudioAndroid: false`, y bloquearlo con
`blockedPermissions` para asegurarse de que no quede en el manifiesto final.

## D6. Expo Go no es tu app

**a) ¿Por qué tus textos de propósito no aparecen cuando probás en Expo Go?**

Porque Expo Go es una app ya compilada (`host.exp.exponent`) con su propio `Info.plist`
y su propio manifiesto. Los textos y permisos que configurás en `app.json` solo se
aplican cuando se genera **tu** binario (development build o standalone).

**b) ¿Qué se puede probar en Expo Go y qué necesita una development build? Pensá en push en Android y en ubicación en segundo plano.**

- **Expo Go**: cámara, ubicación en primer plano, selector de fotos y **notificaciones
  locales**.
- **Development build**: textos de propósito reales, `blockedPermissions`, **push
  remoto en Android** (desde SDK 53 no está disponible en Expo Go), ubicación en segundo
  plano y cualquier módulo nativo que no venga incluido en Expo Go.

**c) Escribí los comandos para ver los archivos nativos generados y para compilar una development build en Android.**

```bash
npx expo prebuild --clean          # genera android/ e ios/
npx expo run:android               # build local (requiere Android Studio/SDK)
# o en la nube, sin Android Studio:
npx eas-cli@latest build --profile development --platform android
```

**d) ¿Cómo volvés un permiso a “sin decidir” sin reinstalar, en Android (adb) y en el simulador de iOS (`xcrun simctl`)?**

```bash
# Android: borra los datos/permisos de la app y la deja como recién instalada
adb shell pm clear com.ipf.mantenimiento

# Alternativa: restablecer permisos de una app
adb shell pm reset-permissions com.ipf.mantenimiento
```

```bash
# Simulador de iOS (no funciona en un iPhone físico)
xcrun simctl privacy booted reset all com.ipf.mantenimiento
# o un servicio puntual:
xcrun simctl privacy booted reset camera com.ipf.mantenimiento
```

---

# Parte E · Recetas: leer y corregir código

## E1. Encontrá los errores (cámara)

Errores del código original:

1. **No maneja `permiso === null`**: en el primer render el hook devuelve `null` y
   `permiso.status` hace crashear la pantalla.
2. **Trata todos los casos no concedidos igual**: muestra “Permitir” aunque el permiso
   esté **bloqueado** (`canAskAgain: false`), donde el botón debe ser “Abrir Ajustes”.
3. **No distingue “preguntable” de “bloqueado”** ni muestra el aviso de bloqueo.
4. **`Explicacion` no está definido ni importado**: el código no compila.
5. **No refresca al volver de Ajustes**: no usa `AppState` ni `consultarPermiso()`.
6. **No hay manejo de errores** de la cámara (`onMountError`).

Versión corregida con los cuatro estados:

```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Button, Linking, Text, View } from 'react-native';

export default function Escanear() {
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();

  // Al volver de Ajustes, releemos el estado real.
  useFocusEffect(
    useCallback(() => {
      void consultarPermiso();
    }, [consultarPermiso])
  );

  // 1) Cargando
  if (!permiso) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 2) Concedido
  if (permiso.granted) {
    return <CameraView style={{ flex: 1 }} facing="back" />;
  }

  // 3) Bloqueado
  if (!permiso.canAskAgain) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24 }}>
        <Text>La cámara está bloqueada. Habilitala desde Ajustes.</Text>
        <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  // 4) Preguntable
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24 }}>
      <Text>Usamos la cámara para leer el QR del aula.</Text>
      <Button title="Continuar" onPress={pedirPermiso} />
    </View>
  );
}
```

## E2. El orden importa (ubicación)

**a) ¿Qué está mal? ¿Qué ocurre en iOS y qué ocurre en Android 11+?**

Pide **primero** el permiso de segundo plano. El permiso de background no se puede
obtener sin el de primer plano. En **iOS**, pedir background sin foreground puede pedir
ambos o fallar silenciosamente; además, si la persona eligió “Permitir una vez”, el
pedido de background falla sin diálogo. En **Android 11+**, el pedido de background abre
la pantalla de Ajustes y requiere que el permiso en primer plano ya esté concedido; si
no, falla. Además, “farmacias cercanas” no necesita segundo plano en absoluto.

**b) Reescribí la función correctamente.**

```ts
export async function activarSeguimiento() {
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) return false;

  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```

**c) `obtenerUbicacion()` que devuelva coordenadas y el booleano `aproximada` (Android e iOS), o `null` sin romper.**

```ts
import * as Location from 'expo-location';

export async function obtenerUbicacion() {
  try {
    // En este proyecto la pantalla previa ya pidió el permiso; acá solo consultamos.
    const permiso = await Location.getForegroundPermissionsAsync();
    if (!permiso.granted) return null;

    const posicion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const aproximada =
      permiso.android?.accuracy === 'coarse' || permiso.ios?.accuracy === 'reduced';

    return {
      latitud: posicion.coords.latitude,
      longitud: posicion.coords.longitude,
      aproximada,
    };
  } catch {
    return null;
  }
}
```

**d) ¿Hace falta segundo plano para “farmacias cercanas”? ¿Qué exige Google Play si lo pedís?**

No hace falta: alcanza con ubicación en primer plano (`while in use`). Si se pide
`ACCESS_BACKGROUND_LOCATION`, Google Play exige **justificar** la función en la ficha y
en el formulario de permisos, mostrar una declaración clara en la app y demostrar que la
función principal la necesita; si no, rechaza la app o elimina la función.

## E3. Notificaciones mudas

**a) ¿Cuál es la causa más probable? ¿Qué hay que hacer antes de pedir el permiso?**

En Android 13+ el permiso es `POST_NOTIFICATIONS` y el diálogo **no aparece hasta que
existe al menos un canal de notificaciones**. Hay que crear el canal con
`Notifications.setNotificationChannelAsync('reportes', { … })` antes de llamar a
`requestPermissionsAsync()`. También hay que asegurarse de que el permiso esté declarado
(lo agrega `expo-notifications`) y de que la app tenga una activity en primer plano.

**b) ¿Qué pasa con este permiso en Android 12 o anterior?**

`POST_NOTIFICATIONS` no existe como permiso de runtime: las notificaciones se conceden
al instalar. `requestPermissionsAsync()` devuelve concedido sin mostrar diálogo.

**c) ¿Qué opción de iOS permite recibir notificaciones sin diálogo? ¿Cómo detectás en código ese estado?**

Las **notificaciones provisionales** (`allowProvisional: true`), disponibles desde
iOS 12. Se piden así:

```ts
const respuesta = await Notifications.requestPermissionsAsync({
  ios: { allowAlert: true, allowBadge: true, allowSound: true, allowProvisional: true },
});

const provisional =
  respuesta.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
```

**d) ¿En qué momento conviene pedir este permiso? Da un ejemplo de buen y de mal momento.**

- **Buen momento**: cuando la persona activa “Avisarme cuando se resuelva mi reporte” y
  entiende el beneficio.
- **Mal momento**: al abrir la app por primera vez, antes de que haya hecho nada, o
  apilado con otros permisos.

## E4. Fotos sin pedir permiso

| Necesidad | Herramienta | Permiso |
| --- | --- | --- |
| Elegir una foto de perfil | `ImagePicker.launchImageLibraryAsync` (selector del sistema) | **Ninguno** |
| Sacar una foto en el momento | `expo-camera` (`CameraView` + `takePictureAsync`) o `launchCameraAsync` | Cámara (runtime) |
| Editor que muestra toda la galería | `expo-media-library` | `READ_MEDIA_IMAGES` (Android 13+) / `NSPhotoLibraryUsageDescription` (iOS) |
| Adjuntar la foto de un comprobante | Selector del sistema (`ImagePicker`) | **Ninguno** |

**¿Por qué Google Play restringe `READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO`? ¿Desde cuándo? ¿Qué es “el mejor permiso”?**

Porque permiten leer **toda** la galería y exponen fotos de otras apps y datos sensibles.
Google Play las restringe desde Android 13 (API 33) y su política de acceso a medios de
2023: solo se aprueban si la función principal de la app realmente necesita acceso
amplio (por ejemplo, un editor de galería completo). Para elegir una foto suelta hay que
usar el **Photo Picker** del sistema. “El mejor permiso es el que no se pide”: si el
selector del sistema alcanza, no se declara ningún permiso de medios.

## E5. Volver de Ajustes

```ts
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior.current !== 'active';
      if (estabaAfuera && nuevo === 'active') revisar();
      anterior.current = nuevo;
    });

    return () => sub.remove();
  }, [revisar]);
}
```

**a) ¿Por qué los hooks de Expo no se enteran solos de que el permiso cambió en Ajustes?**

Porque el cambio ocurre fuera de la app: el sistema no emite un evento de permiso al
proceso. Los hooks guardan el último valor consultado y no vuelven a preguntar solos.
La única señal disponible es que la app vuelve a primer plano (`AppState`), o el foco de
la pantalla, y ahí hay que **volver a consultar**. En Android, además, el sistema puede
matar el proceso al revocar un permiso.

**b) ¿Qué función del hook de cámara le pasarías a `useRevisarAlVolver`?**

El tercer elemento del hook: `consultarPermiso`
(`const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions()`).

**c) ¿Por qué no conviene guardar el estado del permiso en un store global “para siempre”?**

Porque la fuente de verdad es el sistema operativo y la decisión puede cambiar en
cualquier momento: la persona puede revocar el permiso en Ajustes, el sistema puede
revocarlo por inactividad (permisos “Solo esta vez”, apps sin uso) o Android puede matar
el proceso. Un valor cacheado “para siempre” muestra un estado falso y la app intenta
usar un recurso sin permiso. Hay que reconsultar al enfocar y después de cada pedido.

---

# Parte F · Buenas prácticas y tiendas

## F1. Pedir en contexto

| App y permiso | ¿Cuándo pedirlo? | Alternativa si lo deniegan |
| --- | --- | --- |
| Delivery · ubicación | Al elegir la dirección de entrega, con “Usar mi ubicación”. | Escribir la dirección a mano o elegir una zona. |
| Billetera virtual · cámara | Al escanear un QR o capturar un comprobante. | Ingresar los datos a mano o elegir una imagen de la galería. |
| Red social · contactos | Cuando la persona toca “Buscar amigos”. | Buscar por usuario o saltear el paso. |
| Mensajería · micrófono | Al mantener presionado “Grabar nota de voz” por primera vez. | Escribir texto. |
| Turnos médicos · notificaciones | Al activar el recordatorio de un turno. | Aviso por email/SMS o agenda dentro de la app. |
| Editor de fotos · galería completa | Al abrir la galería propia del editor. | Selector del sistema para importar fotos sueltas. |

**¿Por qué pedir cuatro permisos apenas se abre la app “entrena el No permitir automático”?**

Porque la persona no tiene contexto para decidir, siente que la app invade su privacidad
y los diálogos se apilan; responde “No permitir” por reflejo. Peor aún: en Android dos
rechazos bloquean el permiso y en iOS hay una sola oportunidad, así que la app pierde el
acceso para siempre. Pedir en contexto, con una explicación, aumenta la tasa de concesión
y permite ofrecer alternativas.

## F2. La pantalla previa

**a) ¿Qué tres elementos tiene una buena pantalla previa al diálogo del sistema?**

1. El **beneficio concreto** en una frase (qué dato y para qué).
2. **Qué se va a pedir y cuándo** (solo cámara, solo mientras usás la app, etc.).
3. Una **nota de control/privacidad** (“podés cambiarlo en Ajustes”) y una acción clara
   para continuar, más la posibilidad de seguir sin el permiso.

**b) ¿Por qué el botón debe decir “Continuar” y no “Permitir”?**

Porque la app no puede conceder el permiso: quien decide es la persona en el diálogo del
sistema. “Permitir” promete algo que no depende de la app y puede inducir a error; en
cambio “Continuar” es honesto: continúa el flujo y después el sistema pregunta.

**c) ¿Qué dice la pauta 5.1.1(iv) de Apple sobre botones como “Ahora no” o “Cerrar” en esa pantalla?**

La pauta 5.1.1(iv) prohíbe que la pantalla previa **imite o sustituya** el diálogo del
sistema y que use botones que sugieran una decisión (“Permitir”, “Ahora no”, “Cerrar”)
como si fueran parte del diálogo de iOS. La app solo puede explicar el beneficio y
ofrecer “Continuar”; la decisión real la toma la persona en el diálogo del sistema, y
siempre debe poder salir sin conceder. Por eso en este TP la pantalla previa tiene un
único botón “Continuar”.

**d) ¿Cómo cambia la pantalla si el permiso ya está bloqueado?**

Deja de ofrecer “Continuar”: explica que el sistema ya no permite volver a preguntar,
muestra la ruta exacta de Ajustes (Android: Ajustes → Aplicaciones → Mantenimiento IPF →
Permisos → Cámara; iOS: Ajustes → Mantenimiento IPF → Cámara) y el botón pasa a
**“Abrir Ajustes”**. Al volver, la pantalla reconsulta el estado.

## F3. Mínimo privilegio

**a) Ubicación precisa o aproximada para “puntos de reciclaje de tu barrio”.**

**Aproximada**: alcanza para ordenar por cercanía y no expone la ubicación exacta.

**b) Ubicación “en uso” o “siempre” para “registrar una carrera con el celular en el bolsillo”.**

**Siempre** (background): la persona corre con el teléfono guardado y la pantalla puede
estar apagada. Igual hay que pedir primero “en uso” y después “siempre”, justificarlo y
ofrecer una alternativa.

**c) Selector del sistema o permiso de galería para “subir la foto del DNI”.**

**Selector del sistema**: solo se comparte esa foto, sin acceso al resto del álbum.

**d) `expo-camera` con o sin micrófono para “escanear el QR del aula”.**

**Sin micrófono**: `microphonePermission: false`, `recordAudioAndroid: false` y
`RECORD_AUDIO` bloqueado. Solo se necesita la cámara.

## F4. Tiendas

**a) Dos requisitos de Google Play y dos de App Store relacionados con permisos y privacidad.**

Google Play:

1. Declarar y justificar los permisos sensibles (ubicación en segundo plano, SMS,
   contactos, acceso a todos los archivos) en el formulario de permisos; si no, se
   rechaza la app.
2. Completar la sección **Data safety** y usar el Photo Picker en lugar de
   `READ_MEDIA_*` cuando alcance.

App Store:

1. Todos los permisos necesarios deben tener su **texto de propósito** claro en el
   `Info.plist` (pauta 5.1.1).
2. Para rastreo entre apps, usar **ATT** con `NSUserTrackingUsageDescription`; y declarar
   las APIs de motivo requerido en el **privacy manifest** (`PrivacyInfo.xcprivacy`).

**b) ¿Qué es el manifiesto de privacidad (`PrivacyInfo.xcprivacy`) y dónde se configura en Expo?**

Es un archivo de Apple que declara qué datos recolecta la app, si hace tracking y por qué
usa ciertas “required reason APIs” (por ejemplo, almacenamiento o datos del dispositivo).
En Expo se configura con `ios.privacyManifests` en `app.json`; además, los módulos de Expo
y los SDK de terceros aportan su propio manifiesto y se fusionan en la build.

**c) ¿Qué suma Android 17 y qué va a exigir Google Play desde el 27/01/2027 a las apps que hoy piden `READ_CONTACTS`?**

Android 17 suma el permiso **`ACCESS_LOCAL_NETWORK`** para acceder a dispositivos de la
red local (impresoras, TVs, etc.). Según el material de la cátedra, desde el **27/01/2027**
Google Play exigirá a las apps que piden `READ_CONTACTS` que **declaren y justifiquen** el
uso de contactos (o migren a un selector del sistema / dejen de pedirlo); sin esa
declaración no podrán publicar actualizaciones.

## F5. Errores comunes

**a) La consola de Xcode muestra: “This app has crashed because it attempted to access privacy-sensitive data without a usage description.”**

- **Causa**: falta la clave `NS…UsageDescription` correspondiente en el `Info.plist`.
- **Solución**: agregarla con el texto de propósito (en Expo, opción del plugin o
  `ios.infoPlist`) y **recompilar**; no se arregla con OTA.

**b) “En Expo Go anda, en la build no”: en la development build la cámara se deniega sin mostrar ningún diálogo.**

- **Causa**: la build no tiene la declaración/texto de propósito, o el permiso está
  bloqueado por configuración, o se está pidiendo un permiso que no está en el manifiesto.
- **Solución**: revisar el plugin de `expo-camera` y `blockedPermissions` en `app.json`,
  regenerar la build (`prebuild`/EAS) y volver a instalar. Expo Go no sirve como prueba
  de configuración nativa.

**c) Después de habilitar la ubicación en Ajustes, la app sigue diciendo “bloqueado”.**

- **Causa**: la app guardó el estado viejo y no reconsultó al volver; en Android, además,
  el proceso pudo haber sido reiniciado.
- **Solución**: usar `AppState`/`useFocusEffect` y llamar a `getForegroundPermissionsAsync()`
  al volver a primer plano; no cachear el permiso en un store global.

**d) La pantalla queda en “Pidiendo permiso…” para siempre porque el código llama a `request…()` cada vez que se renderiza.**

- **Causa**: se dispara el diálogo en cada render y se repite la promesa; el estado nunca
  se estabiliza.
- **Solución**: pedir solo dentro de un manejador de evento (botón) o en un `useEffect`
  con una guarda; no llamar a `request…()` en el cuerpo del componente.

**e) Una app de turnos no permite entrar a ninguna pantalla si se deniegan las notificaciones.**

- **Causa**: se puso un permiso opcional como requisito de uso.
- **Solución**: desacoplar; permitir entrar y usar la app, ofrecer recordatorios dentro
  de la app o por email/SMS, y pedir las notificaciones recién cuando la persona activa
  un recordatorio.
