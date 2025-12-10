import { computeBetHash, resolveBet } from "@shared/core";

describe("bet utils", () => {
  it("собирает hash как SHA-512 строки salt1|number|salt2", () => {
    const hash = computeBetHash("salt1", 123456, "salt2");
    expect(hash).toHaveLength(128);
  });

  it("корректно определяет победу при выборе min", () => {
    const { isWin } = resolveBet(10_000, 50, "min");
    expect(isWin).toBe(true);
  });
});
