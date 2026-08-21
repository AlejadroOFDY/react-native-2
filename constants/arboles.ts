// Datos de los árboles nativos. Fuente: Arboles_Nativos_Argentina.pdf.
export type Taxonomia = {
  Reino: string;
  División: string;
  Clase: string;
  Orden: string;
  Familia: string;
  Género: string;
  Especie: string;
};

export type Arbol = {
  id: string;
  nombre: string;
  cientifico: string;
  descripcion: string; // breve, para el catálogo
  descripcionDetalle: string; // completa, para la ficha
  taxonomia: Taxonomia;
  imagenPersonalizada?: string | null; // data URI cargada por el usuario
};

export type Lista = {
  id: string;
  nombre: string;
  arboles: string[]; // ids de árboles
};

const tx = (
  Reino: string,
  División: string,
  Clase: string,
  Orden: string,
  Familia: string,
  Género: string,
  Especie: string,
): Taxonomia => ({
  Reino,
  División,
  Clase,
  Orden,
  Familia,
  Género,
  Especie,
});

const M = (
  Reino: string,
  Clase: string,
  Orden: string,
  Familia: string,
  Género: string,
  Especie: string,
): Taxonomia =>
  tx(Reino, "Magnoliophyta", Clase, Orden, Familia, Género, Especie);

export const ARBOLES_15: Arbol[] = [
  {
    id: "ceibo",
    nombre: "Ceibo",
    cientifico: "Erythrina crista-galli",
    descripcion:
      "Flor nacional argentina, de llamativas flores rojas en racimos.",
    descripcionDetalle:
      "Flor nacional argentina. Árbol de tamaño mediano, entre 5 y 10 metros, propio de los bosques ribereños y humedales del litoral. Se destaca por sus racimos de flores rojo intenso que aparecen entre noviembre y marzo. Su madera liviana se usa en artesanías y su corteza tuvo uso medicinal tradicional.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Fabales",
      "Fabaceae",
      "Erythrina",
      "E. crista-galli",
    ),
  },
  {
    id: "jacaranda",
    nombre: "Jacarandá",
    cientifico: "Jacaranda mimosifolia",
    descripcion:
      "Célebre por su floración violeta que cubre la copa en primavera.",
    descripcionDetalle:
      "Nativo del noroeste argentino (Salta, Tucumán, Jujuy), alcanza entre 10 y 15 metros de altura. Es célebre por su floración violeta que cubre por completo la copa en primavera, antes de que aparezcan las hojas. Se cultiva ampliamente como árbol urbano en toda Sudamérica por su valor ornamental.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Lamiales",
      "Bignoniaceae",
      "Jacaranda",
      "J. mimosifolia",
    ),
  },
  {
    id: "algarrobo-blanco",
    nombre: "Algarrobo blanco",
    cientifico: "Prosopis alba",
    descripcion:
      "Vainas dulces (algarroba), alimento tradicional de pueblos originarios.",
    descripcionDetalle:
      "Especie característica de la región chaqueña. Puede superar los 15 metros y desarrolla un tronco grueso y una copa amplia que brinda sombra. Sus vainas dulces (algarroba) fueron y son alimento tradicional de pueblos originarios, usadas para elaborar harina, arrope y patay.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Fabales",
      "Fabaceae",
      "Prosopis",
      "P. alba",
    ),
  },
  {
    id: "ombu",
    nombre: "Ombú",
    cientifico: "Phytolacca dioica",
    descripcion: "Emblema del paisaje pampeano, de enorme copa redondeada.",
    descripcionDetalle:
      "Emblema del paisaje pampeano. No es un árbol leñoso en sentido estricto, sino una gran herbácea perenne de tronco carnoso, muy resistente al fuego y a la sequía. Su copa densa y redondeada puede alcanzar gran diámetro, y su sombra fue históricamente utilizada como punto de reunión en el campo.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Caryophyllales",
      "Phytolaccaceae",
      "Phytolacca",
      "P. dioica",
    ),
  },
  {
    id: "lapacho-rosado",
    nombre: "Lapacho rosado",
    cientifico: "Handroanthus impetiginosus",
    descripcion: "Flores rosadas-violáceas en invierno; madera muy dura.",
    descripcionDetalle:
      "Árbol de las selvas del noroeste y noreste argentino, de hasta 20 metros de altura. Su floración rosada-violácea, explosiva y de corta duración, ocurre en invierno o principios de primavera cuando el árbol pierde las hojas. Su madera, muy dura y duradera, es apreciada en carpintería.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Lamiales",
      "Bignoniaceae",
      "Handroanthus",
      "H. impetiginosus",
    ),
  },
  {
    id: "palo-borracho-rosado",
    nombre: "Palo borracho rosado",
    cientifico: "Ceiba speciosa",
    descripcion: "Tronco verde y ventrudo cubierto de aguijones cónicos.",
    descripcionDetalle:
      "Distribuido en el norte y centro de Argentina. Se reconoce fácilmente por su tronco verde, ventrudo y cubierto de aguijones cónicos, que almacena agua. En otoño produce grandes flores rosadas con centro blanco-amarillento, y luego frutos que liberan una fibra algodonosa llamada 'paina'.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Malvales",
      "Malvaceae",
      "Ceiba",
      "C. speciosa",
    ),
  },
  {
    id: "quebracho-colorado",
    nombre: "Quebracho colorado chaqueño",
    cientifico: "Schinopsis balansae",
    descripcion:
      "Madera extremadamente dura, 'quiebra hacha' del Chaco húmedo.",
    descripcionDetalle:
      "Especie típica del Chaco húmedo, con madera extremadamente dura y densa (de ahí su nombre, 'quiebra hacha'). Rica en taninos, fue históricamente explotada para la industria del curtido. Es un árbol de crecimiento lento que puede superar los 20 metros y vivir varios siglos.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Sapindales",
      "Anacardiaceae",
      "Schinopsis",
      "S. balansae",
    ),
  },
  {
    id: "nandubay",
    nombre: "Ñandubay",
    cientifico: "Prosopis affinis",
    descripcion: "Da nombre a la ecorregión del espinal mesopotámico.",
    descripcionDetalle:
      "Árbol característico del espinal mesopotámico (Entre Ríos, Corrientes), da nombre a la ecorregión del 'Ñandubay'. De porte mediano, copa irregular y madera muy dura y duradera, tradicionalmente usada para postes y varillas por su resistencia a la humedad y el paso del tiempo.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Fabales",
      "Fabaceae",
      "Prosopis",
      "P. affinis",
    ),
  },
  {
    id: "timbo-blanco",
    nombre: "Timbó blanco",
    cientifico: "Enterolobium contortisiliquum",
    descripcion: "Vainas oscuras curvadas en forma de oreja humana.",
    descripcionDetalle:
      "Uno de los árboles nativos de mayor porte, presente en el noreste argentino, con copas que pueden superar los 20 metros de diámetro. Su nombre popular alude a sus llamativas vainas oscuras, curvadas en forma de oreja humana, que permanecen en el árbol tras la caída de las hojas.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Fabales",
      "Fabaceae",
      "Enterolobium",
      "E. contortisiliquum",
    ),
  },
  {
    id: "aguaribay",
    nombre: "Aguaribay (molle)",
    cientifico: "Schinus areira",
    descripcion: 'Frutos rosados que se comercializan como "pimienta rosa".',
    descripcionDetalle:
      "Árbol de follaje colgante y aromático, originario de las regiones áridas y serranas del centro y norte de Argentina. Sus pequeños frutos rosados, agrupados en racimos, se comercializan como 'pimienta rosa'. Fue considerado sagrado por pueblos originarios andinos.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Sapindales",
      "Anacardiaceae",
      "Schinus",
      "S. areira",
    ),
  },
  {
    id: "coihue",
    nombre: "Coihue",
    cientifico: "Nothofagus dombeyi",
    descripcion: "Dominante de los bosques andino-patagónicos, perenne.",
    descripcionDetalle:
      "Especie dominante de los bosques andino-patagónicos, presente en Neuquén, Río Negro y Chubut. Es un árbol de gran porte, perenne, que puede superar los 40 metros de altura. Convive frecuentemente con lengas y araucarias, formando bosques densos y húmedos.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Fagales",
      "Nothofagaceae",
      "Nothofagus",
      "N. dombeyi",
    ),
  },
  {
    id: "pehuen",
    nombre: "Pehuén (araucaria)",
    cientifico: "Araucaria araucana",
    descripcion:
      "Conífera sagrada para el pueblo mapuche, de copa en paraguas.",
    descripcionDetalle:
      "Conífera longeva y sagrada para el pueblo mapuche, propia de la cordillera neuquina. Su copa característica, en forma de paraguas con ramas dispuestas en verticilos, y sus hojas rígidas y punzantes la hacen inconfundible. Sus semillas, los piñones, son un alimento tradicional de gran valor cultural.",
    taxonomia: tx(
      "Plantae",
      "Pinophyta",
      "Pinopsida",
      "Araucariales",
      "Araucariaceae",
      "Araucaria",
      "A. araucana",
    ),
  },
  {
    id: "tala",
    nombre: "Tala",
    cientifico: "Celtis ehrenbergiana",
    descripcion:
      "Pequeño y espinoso, propio de los talares del Río de la Plata.",
    descripcionDetalle:
      "Árbol pequeño y espinoso, muy resistente a la sequía, propio del espinal y la pampa. Forma parte de los talares, bosques bajos característicos de las barrancas del Río de la Plata. Sus frutos anaranjados son consumidos por aves, que dispersan sus semillas.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Rosales",
      "Cannabaceae",
      "Celtis",
      "C. ehrenbergiana",
    ),
  },
  {
    id: "espinillo",
    nombre: "Espinillo",
    cientifico: "Vachellia caven",
    descripcion: "Flores amarillas esféricas y muy perfumadas en primavera.",
    descripcionDetalle:
      "Árbol bajo y espinoso, muy extendido en la pampa, el espinal y zonas serranas. En primavera se cubre de pequeñas flores amarillas, esféricas y muy perfumadas, que le dan un aspecto dorado característico. Tradicionalmente usado como leña, cerco vivo y en medicina popular.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Fabales",
      "Fabaceae",
      "Vachellia",
      "V. caven",
    ),
  },
  {
    id: "lenga",
    nombre: "Lenga",
    cientifico: "Nothofagus pumilio",
    descripcion: "Bosques patagónicos que viran a rojizos y dorados en otoño.",
    descripcionDetalle:
      "Especie caducifolia que forma extensos bosques en la Patagonia andina, desde Neuquén hasta Tierra del Fuego, incluso en el límite de la vegetación arbórea en altura. En otoño sus hojas viran a tonos rojizos y dorados, generando uno de los paisajes más reconocibles de la región.",
    taxonomia: M(
      "Plantae",
      "Magnoliopsida",
      "Fagales",
      "Nothofagaceae",
      "Nothofagus",
      "N. pumilio",
    ),
  },
];
