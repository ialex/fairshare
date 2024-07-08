import {
  ShareType,
  SharePrice,
  ShareholderData,
  GrantData,
  ShareTypeFilter,
  Group,
} from "./types";

export function getSharePrice(type: ShareType, shareprice: SharePrice): number {
  if (type === "preferred") {
    return shareprice?.preferred;
  }
  return shareprice?.common;
}

export function getGroupData(
  shareholders: ShareholderData,
  grants: GrantData,
  shareType: ShareTypeFilter,
  shareprice: SharePrice
) {
  return ["investor", "founder", "employee"].map((group) => ({
    x: group,
    y: Object.values(shareholders)
      .filter((s) => s.group === group)
      .flatMap((s) => s.grants)
      .filter((grantID) =>
        shareType === "" ? true : grants[grantID].type === shareType
      )
      .reduce((acc, grantID) => {
        const price = getSharePrice(grants[grantID].type, shareprice);
        return acc + grants[grantID].amount * price;
      }, 0),
  }));
}

export function getInvestorData(
  shareholders: ShareholderData,
  grants: GrantData,
  shareType: ShareTypeFilter,
  shareprice: SharePrice
) {
  return Object.values(shareholders)
    .map((s) => ({
      x: s.name,
      y: s.grants
        .filter((grantID) =>
          shareType === "" ? true : grants[grantID].type === shareType
        )
        .reduce((acc, grantID) => {
          const price = getSharePrice(grants[grantID].type, shareprice);
          return acc + grants[grantID].amount * price;
        }, 0),
    }))
    .filter((e) => e.y > 0);
}

export function getShareTypeData(
  shareholders: ShareholderData,
  grants: GrantData,
  shareType: ShareTypeFilter,
  shareprice: SharePrice
) {
  const shareTypes = ["common", "preferred"];

  return shareTypes.map((t) => ({
    x: t,
    y: Object.values(grants)
      .filter((g) => g.type === t)
      .reduce((acc, g) => {
        if (shareType && g.type !== shareType) {
          return 0;
        }
        const price = getSharePrice(g.type, shareprice);
        return acc + g.amount * price;
      }, 0),
  }));
}

export function getMarketCap(
  shareholders: ShareholderData,
  grants: GrantData,
  shareprice: SharePrice = { common: 0, preferred: 0 }
) {
  if (Object.keys(grants).length < 1) {
    return 0;
  }
  return Object.values(shareholders).reduce((acc, s) => {
    return (
      acc +
      s.grants.reduce((acc, grantID) => {
        const price = getSharePrice(grants[grantID].type, shareprice);
        return acc + grants[grantID].amount * price;
      }, 0)
    );
  }, 0);
}

export function getDataByMode(
  mode: Group = "group",
  shareholders: ShareholderData,
  grants: GrantData,
  shareType: ShareTypeFilter,
  shareprice: SharePrice = { common: 0, preferred: 0 }
) {
  if (mode === "group") {
    return getGroupData(shareholders, grants, shareType, shareprice);
  }
  if (mode === "investor") {
    return getInvestorData(shareholders, grants, shareType, shareprice);
  }
  if (mode === "sharetype") {
    return getShareTypeData(shareholders, grants, shareType, shareprice);
  }
}
