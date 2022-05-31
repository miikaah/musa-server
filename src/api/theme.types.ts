import type { DbTheme } from "musa-core";

export type Theme = Omit<DbTheme, "path_id"> & { id: string };
