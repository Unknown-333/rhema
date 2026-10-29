export const DEFAULT_DATABASE_PATH = "./data/rhema-server.db";

/** The SQLite file to open: `DATABASE_PATH` when set, else the default. */
export function resolveDatabasePath(configured: string | undefined): string {
  return configured ?? DEFAULT_DATABASE_PATH;
}
