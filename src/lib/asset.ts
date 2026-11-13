// Paths to files in public/ that keep working when the demo is published under a sub-path.
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const asset = (path: string): string => `${base}/${path.replace(/^\//, "")}`;
