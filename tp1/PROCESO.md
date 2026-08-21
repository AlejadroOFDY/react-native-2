Primeramente se generó el proyecto con el comando npx create-expo-app@latest y utilizaremos la versión 54 de expo.

Una vez creado la base, abrimos el copilot en vs code y utilizamos @ponytail que es una skill para que la IA sea más eficiente, como en el visual solo esa una extensión, lo que hace es mandar un prompt al copilot y luego uno manda el suyo propio
Ponytail:
PONYTAIL MODE ACTIVE — level: ultra

You are a practical developer. practical means efficient, not careless. The best code is the code never written.

The Ladder
Before any code, stop at the first rung that holds (read the code it touches and trace the real flow first):

Does this need to be built at all?
Does it already exist in this codebase? Reuse it.
Does the standard library do this? Use it.
Does a native platform feature cover it? Use it.
Does an already-installed dependency solve it? Use it.
Can this be one line? Make it one line.
Only then: write the minimum code that works.
Bug fix = root cause, not symptom.

Rules
No abstractions that were not requested.
No avoidable dependencies.
No boilerplate nobody asked for.
Deletion over addition. Boring over clever. Fewest files possible.
Ship the practical version and question the complex request in the same response.
Mark intentional simplifications with a ponytail: comment.
Never re-reference images from previous conversations or old commits — ask the user to provide fresh if needed.
Before entering a debug/iterative loop, warn: "⚠️ Iterative debug session — token cost will be high regardless of Ponytail. Proceed?" Wait for confirmation.
Output
Code first. Then at most three short lines: what was skipped, when to add it.
If the explanation is longer than the code, delete the explanation.

Never Simplify Away
Input validation at trust boundaries, error handling that prevents data loss, security measures, accessibility basics, anything the user explicitly asked to keep.

Non-trivial logic leaves ONE runnable check behind.

Ultra Mode
Challenge every line. If a file can be deleted instead of edited, delete it. If a feature can be dropped, say so. Maximum deletion, minimum addition. Question whether the task itself is necessary.

Luego procedimos a realizar nuestro primer prompt.
Prompt:
Siguiendo las consingas de este trabajo realizarás lo siguiente, una aplicación web sin backend, constando esta de 4 vistas, la temática será árboles nativos de argentina. En la primera vista utilizarás la imagen del Ceibo.avif como fondo, en letras h1 negras y con un bordeado blanco (el cual usarás en todas las letras para evitar que haya textos que sean ilegibles o queden mezclados con el fondo) "Especies Arbóreas Autóctonas de Argentina", debajo dejando varios espacios en texto, "En este trabajo se hablará de las especies arbóreas de Argentina, como una forma de expresar la importancia de los mismos, así como también reflejar nuestro gusto por estos", ambos textos estarán centrados, debajo un botón que dirá "Ver catálogo" (que llevará a la segunda vista), redondeado color verde de letras blancas h3 de borde negro (todos los botones serán así). Todas las letras de todas las vistas serán de la tipografía Times New Roman
-En la segunda vista tendremos una lista de árboles por defecto (los cuales serán el ceibo, el jacarandá, el lapacho rosado y el quebracho colorado), de fondo utilizarás la imagen del jacarandá, en h2 dirá Árboles Actuales arriba a la izquierda, y del lado contrario habrá un botón que dirá "Agregar Árbol", y debajo (tanto el texto como el botón estarán en una misma caja, caja1), debajo habrá una caja (caja2) que contendrá 4 cajas (será una caja por árbol y se agregarán más cuando alguien utilice el botón agregar arbol), en esas cajas estarán el nombre de los árboles, junto con una pequeña descripción (búscalo en internet), al hacer click o tocar (si se está en el teléfono) nos mandará a otra vista propia de ese árbol donde habrá en el centro una imagen (por defecto la imagen Arbol-Genérico como Placeholder), debajo un botón (subir imagen, donde el usuario podrá cargar la imagen, aunque para los 4 árboles por defecto ya estarán cargadas sus respectivas imágenes), debajo su nombre oficial, nombre científico, su taxonomía y una descripción de sus características y debajo del todo a la derecha un botón que diga "Agregar a favoritos" que estará relacionada con la tercer vista.
-Tercer vista, "Favoritos", en esta vista utilizarás el Lapacho-Rosado como fondo, y será una caja que tendrá otra caja, que será redondeada, con línea de puntos y que tenga un + dentro, y abajo un botón crear listas, al pulsarlo, se abrirá una ventana donde pedirá colocar el nombre de la lista y un botón de aceptar, una vez hecho eso se creará la lista y al hacer click en la cajita punteada que tendrá su nombre arriba, te mostará los árboles guardados como pequeñas tarjetas alargadas y redondeadas, si no hay ninguna, te mandará a la segunda vista para que selecciones algún árbol y después uses el botón para agregar a la lista, una vez cargado el árbol o si ya hay alguno, deberás poder seguir agregando, eliminar alguno o guardar la lista (todo deberá guardarse en local de acuerdo a las consignas del pdf).
-En la cuarta vista será la de "¡Algunos Árboles más!", ese será el título centrado en h1 negro, y la imagen de fondo será el Quebracho-Colorado, debajo en una caja dirá "Espera mientras nuestra backend responde..." pero como se trata de un mock como solocita la consigna, pasados 3 segundos se mostrará los árboles con su imagen (que es la de árbol genérico) y su descripción (ignora la taxonomia) de los 15 árboles en el pdf (todas las imágenes y el pdf están en lar carpeta assets).
Por último crea los archiovs.md solicitados en la consigna del trabajo

El resultado fue muy bueno pero está lejos de ser completo o suficiente, para solucionar los problemas usamos el siguiente prompt (además también porque el chat del copilot solo se guarda en local y desde este prompt en adelante lo trabajamos en otra máquina).

-Segundo Prompt:
Vamos a hacer unas correcciónes, dado que el trabajo consta de 4 vistas, debe existir la posibilidad de moverse a las 4 vistas en cualquier momento, agrega el típico menú mobile que tiene cualquier proyecto de expo que recién inicia para cambiar a las demás vistas sin importar donde estés, que sea de color negro.
-Además quiero que la primer vista tenga el texto justificado.

Este segundo prompt arregló los problemas solicitados, sin embargo, para evitar que la IA pueda arruinar lo ya construido, las siguientes correcciones se harán en prompts individuales.

-Tercer Prompt:
Ahora debes solucionar el siguiente problema, la vista de favoritos tiene la capacidad de crear listas pero falta el poder eliminar las listas, además en la ventana que se abre cuando uno selecciona un arbol en la segunda vista para agregar a la lista de favoritos no hay ningún menú para desplazarte a la vista original, la segunda, agrega un botón arriba a la izquierda que diga volver y te mande a la segunda vista.

Funcionó pero todavía faltan detalles por pulir.

-Cuarto Prompt:
La segunda vista tiene un problema, el botón de Agregar Arbol casi se superpone con el texto Arboles Actuales en dispositivos Android, en la versión web funciona, pero en smartphones no debido a la diferencia de pantalla, hazlo responsive, además el botón Agregar árbol habre una ventana que no tiene botón para salir, agrégalo también y por último, en la versión web se puede guardar en local los cambios, las listas creadas, los árboles agregados, etc, pero en la versión mobile sale el mensaje "Alert No se pudo guardar en el almacenamiento local", si es posible haz que también se guarde ahí de manera local.

-Quinto Prompt:
En la vista de Catalogo falta la posibilidad de eliminar los árboles existentes y ya sea debido al peso o por otro motivo la imagen del ceibo de la primera vista no se muestra, solo se ve un fondo en blanco, y los demás fondos de las demás vistas se ven alargadas, haz que se adapten a la pantalla.

No funcionó así que deshice los cambios

-Sexto Prompt:
Agrega a la segunda vista, la posibilidad de eliminar los árboles existentes, y en la primera vista agrega dos recuadros blancos con bordes redondeados y negros como en las demás vistas, uno para el título y otro para el texto. Y por último quiero que soluciones el problema de que la primer imagen del ceibo en dispositivos móviles no se muestra adecuadamente, el fondo queda en blanco, ya sea por una cuestion de tamaño, peso o formato, arréglalo también.

Todo está funcional y la versión mobile funciona bien pero las imágenes de la versión web no ya no se ven bien.

-Séptimo Prompt: 
La versión web y mobile funcionan perfectamente, y los fondos de la versión mobile se ven perfectamente, sin embargo, al hacer el cambio ya sea de formato u otro, en la versión web las imágenes que antes se veían bien ahora no, la imagen del ceibo de la primera vista se ve cortada, quedando toda una parte en blanco, y las imágenes de la segunda y tercer vista ahora se ven borrosas, no quiero que tu corrección toque nada de la versión para teléfonos, eso está perfecto, pero la versión web debe corregirse, ya sea volviendo la imagen como estaba o descargando la imagen original del repositorio y manteniendo dos imágenes, una para la versión web y otra para la mobile.

-Octavo Prompt:
Justifica nuevamente el texto de la primera vista y céntralo

Ahora sí, todo quedó perfecto.