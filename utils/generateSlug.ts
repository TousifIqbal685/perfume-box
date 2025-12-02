export function generateSlug(brand: string, title: string) {
  const base = `${brand} ${title}`;

  return base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")   // convert spaces/symbols to hyphens
    .replace(/(^-|-$)+/g, "");     // remove hyphens from start/end
}
