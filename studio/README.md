# Studio de Novedades (Sanity)

Panel de administración para que la Dra. Visentini publique novedades (links, notas propias,
imágenes y PDFs) sin tocar código. El sitio web las lee vía la API pública de Sanity.

## Puesta en marcha (una sola vez)

Proyecto ya creado: **projectId `7785uef4`**, dataset `production` (público). Falta:

1. `cd studio && npm install`
2. En https://www.sanity.io/manage → proyecto "Dra Visentini — Novedades" → **API** → **CORS origins**, agregar:
   - El dominio final del sitio (ej. `https://tudominio.com`)
   - `http://localhost:3000` (o el puerto que uses para probar en local)
   - Sin marcar "Allow credentials".
3. `npx sanity deploy` — elegir un subdominio (ej. `dani-visentini`), queda publicado en
   `https://dani-visentini.sanity.studio`.
4. En **Manage → Members**, invitar a la Dra. Visentini con rol **Editor** y mandarle el link del
   Studio del paso anterior.

## Uso diario (para ella)

1. Entrar a `https://<subdominio>.sanity.studio` y loguearse.
2. "Novedad" → **Create new**.
3. Elegir **tipo**:
   - *Link a noticia/estudio externo*: completar título, resumen, URL y fuente.
   - *Nota propia*: completar título, resumen y escribir el cuerpo en el editor de texto.
4. Opcional: subir una imagen de portada y/o adjuntar PDFs.
5. Tildar **Publicado** y guardar (Sanity guarda solo, no hace falta un botón "publish" aparte en
   el free tier con el dataset público — el documento se lee apenas se guarda).
6. El sitio muestra el cambio en menos de un minuto (hay un caché corto de CDN).

## Desarrollo local

`npm run dev` levanta el Studio en `http://localhost:3333` para probar el schema antes de deployar.
