import { defineField, defineType } from "sanity";

export default defineType({
  name: "novedad",
  title: "Novedad",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titulo", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tipo",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Link a noticia/estudio externo", value: "link" },
          { title: "Nota propia", value: "nota" },
        ],
        layout: "radio",
      },
      initialValue: "link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fecha",
      title: "Fecha",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "resumen",
      title: "Resumen",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(280),
      description: "Se muestra en la tarjeta de listado. Máx. 280 caracteres.",
    }),
    defineField({
      name: "portada",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "url",
      title: "URL externa",
      type: "url",
      hidden: ({ document }) => document?.tipo !== "link",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).custom((value, context) => {
          if (context.document?.tipo === "link" && !value) {
            return "La URL es obligatoria para novedades de tipo link";
          }
          return true;
        }),
    }),
    defineField({
      name: "fuente",
      title: "Fuente",
      type: "string",
      description: 'Ej: "Revista Chest", "AASM"',
      hidden: ({ document }) => document?.tipo !== "link",
    }),
    defineField({
      name: "cuerpo",
      title: "Cuerpo de la nota",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      hidden: ({ document }) => document?.tipo !== "nota",
    }),
    defineField({
      name: "adjuntos",
      title: "Adjuntos (PDFs)",
      type: "array",
      of: [
        {
          type: "object",
          name: "adjunto",
          fields: [
            { name: "titulo", title: "Título del adjunto", type: "string" },
            { name: "file", title: "Archivo", type: "file" },
          ],
        },
      ],
    }),
    defineField({
      name: "publicado",
      title: "Publicado",
      type: "boolean",
      initialValue: false,
      description: "Solo las novedades publicadas se muestran en el sitio.",
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "fecha", media: "portada" },
  },
});
