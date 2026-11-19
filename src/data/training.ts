export type Media =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string; alt: string };

export type Category = {
  id: string;
  label: string;
  items: Media[];
};

export const categories: Category[] = [
  {
    id: "kickboxing",
    label: "Kickboxing • Muay Thai",
    items: [
      {
        kind: "photo",
        src: "/img/entrenamiento/kickBoxing/fotoKick00.webp",
        alt: "Entrenamiento de Kick Boxing y Muai Thai",
      },
      {
        kind: "video",
        src: "/video/Video_kickBoxing/videoKick.webm",
        alt: "Entrenamiento de Kick Boxing y Muai Thai",
      },
      {
        kind: "video",
        src: "/img/entrenamiento/kickBoxing/fotoKick04.webp",
        alt: "Entrenamiento de Kick Boxing y Muai Thai",
      },
      {
        kind: "photo",
        src: "/img/entrenamiento/kickBoxing/fotoKick01.webp",
        alt: "Entrenamiento de Kick Boxing y Muai Thai",
      },
      {
        kind: "photo",
        src: "/img/entrenamiento/kickBoxing/fotoKick03.webp",
        alt: "Entrenamiento de Kick Boxing y Muai Thai",
      },
      {
        kind: "photo",
        src: "/img/entrenamiento/kickBoxing/fotoKick02.webp",
        alt: "Entrenamiento de Kick Boxing y Muai Thai",
      },
      {
        kind: "video",
        src: "/video/Video_kickBoxing/videoKick01.webm",
        alt: "Entrenamiento de Kick Boxing y Muai Thai",
      }
    ],
  },
  {
    id: "musculacion",
    label: "Musculación y Clases Personalizadas",
    items: [
      {
        kind: "video",
        src: "/video/musculacionVideo/personalizadaVideo_01.webm",
        alt: "Entrenamiento personalizado con kettlebells",
      },
      {
        kind: "photo",
        src: "/img/entrenamiento/musculacion/musculacion01.webp",
        alt: "Grupo entrenando con kettlebells",
      },
      {
        kind: "video",
        src: "/video/musculacionVideo/personalizadaVideo_02.webm",
        alt: "Peso muerto con barra",
      },
      {
        kind: "photo",
        src: "/img/entrenamiento/musculacion/musculacion02.webp",
        alt: "Entrenamiento con barra y acompañamiento",
      },
      {
        kind: "photo",
        src: "/img/entrenamiento/musculacion/musculacion03.webp",
        alt: "Grupo entrenando en el gimnasio",
      },
    ],
  },
];
