import { describe, expect, it } from "vitest";
import { isInstitutionalGoogleAccount } from "./institutional-auth";

describe("isInstitutionalGoogleAccount", () => {
  it("accepts a verified institutional account", () => {
    expect(
      isInstitutionalGoogleAccount(
        "usuario@cesmag.edu.co",
        "cesmag.edu.co",
        "cesmag.edu.co",
        true,
      ),
    ).toBe(true);
  });

  it("rejects an unverified or external domain", () => {
    expect(
      isInstitutionalGoogleAccount(
        "usuario@gmail.com",
        "gmail.com",
        "cesmag.edu.co",
        true,
      ),
    ).toBe(false);
    expect(
      isInstitutionalGoogleAccount(
        "usuario@cesmag.edu.co",
        "cesmag.edu.co",
        "cesmag.edu.co",
        false,
      ),
    ).toBe(false);
  });

  it("rejects a mismatched verified domain", () => {
    expect(
      isInstitutionalGoogleAccount(
        "usuario@cesmag.edu.co",
        "external.edu.co",
        "cesmag.edu.co",
        true,
      ),
    ).toBe(false);
  });
});
