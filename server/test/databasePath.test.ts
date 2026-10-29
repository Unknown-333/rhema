import { describe, expect, test } from "bun:test";
import {
  DEFAULT_DATABASE_PATH,
  resolveDatabasePath,
} from "../src/databasePath";

describe("database path", () => {
  test("a deployment without DATABASE_PATH gets the default file", () => {
    expect(resolveDatabasePath(undefined)).toBe(DEFAULT_DATABASE_PATH);
    expect(DEFAULT_DATABASE_PATH).toBe("./data/rhema-server.db");
  });

  test("a configured path is used as given", () => {
    expect(resolveDatabasePath("/srv/accounts.db")).toBe("/srv/accounts.db");
  });
});
