import { site } from "./site";

export type Faq = {
  question: string;
  answer: string;
  /** Muestra el mapa de Google Maps debajo de la respuesta */
  showMap?: boolean;
};

export const faqs: Faq[] = [
  {
    question: "¿Qué tipos de entrenamiento ofrecen?",
    answer:
      "Ofrecemos Kick Boxing y Muay Thai, Musculación con clases personalizadas, y rutinas de preparación física adaptadas a cada persona.",
  },
  {
    question: "¿Cuáles son los horarios?",
    answer:
      "Los horarios varían según la clase. Escribinos por WhatsApp y te pasamos la grilla actualizada.",
  },
  {
    question: "¿Dónde queda ubicado el gimnasio?",
    answer: `Estamos en ${site.location.address}, ${site.location.city}.`,
    showMap: true,
  },
  {
    question: "¿Cómo puedo inscribirme?",
    answer:
      "Podés escribirnos por WhatsApp o usar el botón de Contacto. Te respondemos y coordinamos tu primera clase.",
  },
  {
    question: "¿Se puede entrenar con un amigo/a?",
    answer:
      "Sí, muchas clases se pueden hacer en pareja o grupo. Consultanos por las opciones disponibles.",
  },
  {
    question: "¿Tienen planes personalizados?",
    answer:
      "Sí. Armamos un plan según tus objetivos, tu disponibilidad y tu condición física, con seguimiento constante.",
  },
];