export interface User {
  name: string;
  email: string;
  shareholderID?: number;
}
export interface Company {
  name: string;
}
export type ShareType = "common" | "preferred";
export interface Grant {
  id: number;
  name: string;
  amount: number;
  issued: string;
  type: ShareType;
}

export interface Shareholder {
  id: number;
  name: string;
  // TODO: allow inviting/creating user account for orphan shareholders
  email?: string;
  grants: number[];
  group: "employee" | "founder" | "investor";
}

export type Group = "investor" | "sharetype" | "group";
export type ShareholderGroup = 'investor' | 'founder' | 'employee';
export type ShareholderData = { [dataID: number]: Shareholder };
export type GrantData = { [dataID: number]: Grant };
export interface SharePrice {
  common: float;
  preferred: float;
}
export type ShareTypeFilter = ShareType | "";

export interface OnboardingFields {
  companyName: string;
  userName: string;
  email: string;
  shareprice: SharePrice;
  shareholders: { [shareholderID: number]: Shareholder };
  grants: { [grantID: number]: Grant };
}
interface UpdateUserAction {
  type: "updateUser";
  payload: string;
}
interface UpdateEmail {
  type: "updateEmail";
  payload: string;
}
interface UpdateCompanyAction {
  type: "updateCompany";
  payload: string;
}
interface AddShareholderAction {
  type: "addShareholder";
  payload: Omit<Shareholder, "id" | "grants">;
}
interface AddGrant {
  type: "addGrant";
  payload: { shareholderID: number; grant: Omit<Grant, "id"> };
}
interface UpdateSharePriceAction {
  type: "updateShareprice";
  payload: SharePrice;
}
export type OnboardingAction =
  | UpdateUserAction
  | UpdateEmail
  | UpdateCompanyAction
  | AddShareholderAction
  | AddGrant
  | UpdateSharePriceAction;