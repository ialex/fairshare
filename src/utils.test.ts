import { GrantData, SharePrice, ShareholderData } from "./types";
import {
  getGroupData,
  getInvestorData,
  getMarketCap,
  getSharePrice,
  getShareTypeData,
} from "./utils";

describe("getSharePrice", () => {
  const shareprice: SharePrice = {
    common: 100,
    preferred: 200,
  };
  it("should return the common share price when type is 'common'", () => {
    const result = getSharePrice("common", shareprice);
    expect(result).toBe(100);
  });

  it("should return the preferred share price when type is 'preferred'", () => {
    const result = getSharePrice("preferred", shareprice);
    expect(result).toBe(200);
  });
});

describe("getMarketCap", () => {
  const shareholders: ShareholderData = {
    "1": {
      name: "Alejandro V",
      grants: [1],
      id: 1,
      group: "founder",
    },
    "2": {
      name: "Nathan",
      grants: [2],
      id: 1,
      group: "investor",
    },
  };
  const grants: GrantData = {
    1: { name: "buy", issued: "2024-07-05", amount: 10, id: 1, type: "common" },
    2: {
      name: "buy",
      issued: "2024-07-05",
      amount: 10,
      id: 2,
      type: "preferred",
    },
  };

  const mockSharePrice: SharePrice = { common: 10, preferred: 20 };
  it("should calculate the market cap correctly for multiple shareholders", () => {
    const marketCap = getMarketCap(shareholders, grants, mockSharePrice);
    expect(marketCap).toBe(10 * 10 + 10 * 20);
  });

  it("should return 0 if there are no shareholders", () => {
    const marketCap = getMarketCap({}, grants, mockSharePrice);
    expect(marketCap).toBe(0);
  });

  it("should return 0 if there are no grants", () => {
    const marketCap = getMarketCap(shareholders, {}, mockSharePrice);
    expect(marketCap).toBe(0);
  });
});

describe("getGroupData", () => {
  const shareholders: ShareholderData = {
    "1": {
      name: "Alejandro V",
      grants: [1],
      id: 1,
      group: "founder",
    },
    "2": {
      name: "Nathan",
      grants: [2],
      id: 1,
      group: "investor",
    },
  };

  const grants: GrantData = {
    1: { name: "buy", issued: "2024-07-05", amount: 10, id: 1, type: "common" },
    2: {
      name: "buy",
      issued: "2024-07-05",
      amount: 10,
      id: 2,
      type: "preferred",
    },
  };

  const mockSharePrice: SharePrice = { common: 10, preferred: 20 };

  it("should calculate group data correctly with no share type filter", () => {
    const result = getGroupData(shareholders, grants, "", mockSharePrice);
    expect(result).toEqual([
      { x: "investor", y: 200 },
      { x: "founder", y: 100 },
      { x: "employee", y: 0 },
    ]);
  });

  it("should calculate group data correctly with 'common' share type filter", () => {
    const result = getGroupData(shareholders, grants, "common", mockSharePrice);
    expect(result).toEqual([
      { x: "investor", y: 0 },
      { x: "founder", y: 100 },
      { x: "employee", y: 0 },
    ]);
  });

  it("should calculate group data correctly with 'preferred' share type filter", () => {
    const result = getGroupData(
      shareholders,
      grants,
      "preferred",
      mockSharePrice
    );
    expect(result).toEqual([
      { x: "investor", y: 200 },
      { x: "founder", y: 0 },
      { x: "employee", y: 0 },
    ]);
  });
});

describe("getInvestorData", () => {
  const shareholders: ShareholderData = {
    "1": {
      name: "Alejandro V",
      grants: [1],
      id: 1,
      group: "founder",
    },
    "2": {
      name: "Nathan",
      grants: [2],
      id: 1,
      group: "investor",
    },
  };

  const grants: GrantData = {
    1: { name: "buy", issued: "2024-07-05", amount: 10, id: 1, type: "common" },
    2: {
      name: "buy",
      issued: "2024-07-05",
      amount: 10,
      id: 2,
      type: "preferred",
    },
  };

  const mockSharePrice: SharePrice = { common: 10, preferred: 20 };

  it("should calculate investor data correctly with no share type filter", () => {
    const result = getInvestorData(shareholders, grants, "", mockSharePrice);
    expect(result).toEqual([
      { x: "Alejandro V", y: 100 },
      { x: "Nathan", y: 200 },
    ]);
  });

  it("should calculate investor data correctly with 'common' share type filter", () => {
    const result = getInvestorData(
      shareholders,
      grants,
      "common",
      mockSharePrice
    );
    expect(result).toEqual([{ x: "Alejandro V", y: 100 }]);
  });

  it("should calculate investor data correctly with 'preferred' share type filter", () => {
    const result = getInvestorData(
      shareholders,
      grants,
      "preferred",
      mockSharePrice
    );
    expect(result).toEqual([{ x: "Nathan", y: 200 }]);
  });
});

describe("getShareTypeData", () => {
  const shareholders: ShareholderData = {
    "1": {
      name: "Alejandro V",
      grants: [1],
      id: 1,
      group: "founder",
    },
    "2": {
      name: "Nathan",
      grants: [2],
      id: 1,
      group: "investor",
    },
  };

  const grants: GrantData = {
    1: { name: "buy", issued: "2024-07-05", amount: 10, id: 1, type: "common" },
    2: {
      name: "buy",
      issued: "2024-07-05",
      amount: 10,
      id: 2,
      type: "preferred",
    },
  };

  const mockSharePrice: SharePrice = { common: 10, preferred: 20 };

  it("should calculate share type data correctly with no share type filter", () => {
    const result = getShareTypeData(shareholders, grants, "", mockSharePrice);
    expect(result).toEqual([
      { x: "common", y: 100 },
      { x: "preferred", y: 200 },
    ]);
  });

  it("should calculate share type data correctly with 'common' share type filter", () => {
    const result = getShareTypeData(
      shareholders,
      grants,
      "common",
      mockSharePrice
    );
    expect(result).toEqual([
      { x: "common", y: 100 },
      { x: "preferred", y: 0 },
    ]);
  });

  it("should calculate share type data correctly with 'preferred' share type filter", () => {
    const result = getShareTypeData(
      shareholders,
      grants,
      "preferred",
      mockSharePrice
    );
    expect(result).toEqual([
      { x: "common", y: 0 },
      { x: "preferred", y: 200 },
    ]);
  });
});
