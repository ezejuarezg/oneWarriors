# One Warrior

Landing page para el gimnasio One Warrior, en Chascomús, Buenos Aires. Entrenamiento personalizado, kickboxing, Muay Thai y musculación.

Construida con Astro 7, React, TypeScript y Tailwind CSS v4.

## Requisitos

- Node.js 20 o superior (verificá la versión mínima en la guía de Astro 7)
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre el sitio en `http://localhost:4321`.

## Build de producción

```bash
npm run build
npm run preview
```

El resultado queda en la carpeta `dist/`.

## Estructura

```
src/
├── components/     Secciones de la página y componentes reutilizables
├── data/           Datos editables del sitio (contacto, horarios, FAQ, entrenamientos)
├── hooks/          Lógica compartida (scroll a secciones)
├── layouts/        Layout base con fuentes, scripts y navbar
├── lib/            Utilidades (instancia de Lenis)
├── pages/          Página principal (index.astro)
└── styles/         Estilos globales y tema de colores
public/
├── img/            Imágenes del sitio
├── video/          Videos de entrenamiento
├── robots.txt      Indicaciones para buscadores
└── llms.txt        Resumen del sitio para modelos de lenguaje
```

## Secciones

1. Hero, con propuesta de valor y accesos rápidos.
2. Entrenamiento, con carrusel de fotos y videos por categoría.
3. Sobre mí, con fotos, pilares y CTA.
4. Preguntas frecuentes, con acordeón y mapa de Google en la pregunta de ubicación.
5. Ubicación y horarios.
6. Contacto, con canales directos.
7. Footer.

## Dónde editar los datos

| Qué cambiar | Archivo |
|---|---|
| Dirección, coordenadas, WhatsApp, email, redes, horarios | `src/data/site.ts` |
| Preguntas y respuestas | `src/data/faq.ts` |
| Fotos y videos por categoría | `src/data/entrenamiento.ts` |
| Colores y fuentes | `src/styles/global.css` |

Después de cambiar la dirección o los horarios, actualizá también `public/llms.txt`, porque ese archivo tiene los mismos datos.

## Consideraciones técnicas

- **Animaciones de entrada:** se reproducen una sola vez por sesión del navegador. El script de `Layout.astro` y los hooks de sección usan `sessionStorage` con las claves `ow-*`.
- **Carga diferida:** las secciones se cargan con `client:visible` y las fotos y videos se piden cuando están cerca de la pantalla.
- **Mapa de Google:** el iframe de FAQ solo se monta cuando la pregunta está abierta. No requiere API key.
- **Scroll suave:** usa Lenis, y se desactiva si el usuario pide reducir movimiento.
- **Videos:** están en formato `.webm`. Si necesitás compatibilidad con Safari en iPhone, agregá versiones `.mp4`.

## Seguridad

- Headers recomendados: ver `vercel.json` o `public/_headers`, según el hosting.
- Dependencias: se corrigieron las vulnerabilidades críticas de Astro. Quedan advertencias de `picomatch` en el build, documentadas en el historial del repositorio.
- No hay formularios ni datos de usuarios.

## Deploy

El sitio es estático. Se puede publicar en Vercel, Netlify o cualquier hosting que sirva la carpeta `dist/`.

Al publicar:

1. Reemplazá `tu-dominio.com` en `public/robots.txt` y `public/llms.txt`.
2. Verificá los headers de seguridad en https://securityheaders.com.
3. Creá las páginas `/terminos` y `/privacidad` que enlaza el footer, o quitá esos enlaces.

## Pendientes

- Páginas legales (`/terminos` y `/privacidad`).
- Sitemap, si se quiere indexar más páginas que la principal.
- Versiones `.mp4` de los videos para Safari.