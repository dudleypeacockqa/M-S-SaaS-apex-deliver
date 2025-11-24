import { describe, expect, it } from "vitest";

import { maSolutionsLinks, solutionsLinks } from "@/components/marketing/financeflo/navigation/navigationData";

const expectedPaths = [
  "/capliquify-fpa",
  "/features",
  "/4-stage-cycle",
  "/solutions/cfo",
  "/sales-promotion-pricing",
];

describe("FinanceFlo navigation data", () => {
  it("pins the M&A & Finance Solutions group at the top of the solutions menu", () => {
    expect(solutionsLinks[0]?.name).toBe("M&A & Finance Solutions");
    expect(solutionsLinks[0]?.subLinks).toEqual(maSolutionsLinks);
  });

  it("lists all legacy FinanceFlo destinations inside maSolutionsLinks", () => {
    expect(maSolutionsLinks.map((link) => link.path)).toEqual(expectedPaths);
  });
});
