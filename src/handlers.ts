import { rest } from "msw";
import { Company, User, Shareholder, Grant } from "./types";

function nextID(collection: { [key: number]: unknown }) {
  return (
    Math.max(0, ...Object.keys(collection).map((e) => parseInt(e, 10))) + 1
  );
}
function storeState(state: any): void {
  localStorage.setItem("data", JSON.stringify(state));
}

export function getHandlers(
  params: {
    company?: Company;
    users?: { [email: string]: User };
    shareholders?: { [id: number]: Shareholder };
    grants?: { [id: number]: Grant };
  } = {},
  persist: boolean = false
) {
  let { company, users = {}, shareholders = {}, grants = {} } = params;
  if (persist) {
    storeState({
      shareholders,
      users,
      grants,
      company,
    });
    setInterval(() => {
      if (localStorage.getItem("data")) {
        storeState({
          shareholders,
          users,
          grants,
          company,
        });
      }
    }, 5000);
  }
  return [
    // Yes, this is a passwordless login
    rest.post<{ email: string }>("/signin", (req, res, ctx) => {
      const { email } = req.body;
      const user = Object.values(users).find((user) => user.email === email);
      if (!user) {
        return res(ctx.status(401));
      }

      return res(ctx.json(user));
    }),

    rest.post<Company, Company>("/company/new", (req, res, ctx) => {
      company = req.body;
      return res(ctx.json(company));
    }),

    rest.post<Omit<Shareholder, "id">>(
      "/shareholder/new",
      (req, res, ctx) => {
        const { name, email, grants = [], group } = req.body;
        const shareholder: Shareholder = {
          name,
          email,
          grants,
          id: nextID(shareholders),
          group,
        };
        shareholders[shareholder.id] = shareholder;
        if (email) {
          const existingUser = users[email];
          if (existingUser.shareholderID) {
            // User already has a shareholder ID
            console.error("User already has a shareholder ID");
            return res(ctx.status(400));
          }
          users[email].shareholderID = shareholder.id;
        }

        return res(ctx.json(shareholder));
      }
    ),

    rest.post<{ shareholderID?: number; grant: Omit<Grant, "id"> }>(
      "/grant/new",
      (req, res, ctx) => {
        const {
          shareholderID,
          grant: { issued, name, amount, type },
        } = req.body;
        const grant: Grant = { name, issued, amount, id: nextID(grants), type };
        grants[grant.id] = grant;

        if (
          typeof shareholderID !== "undefined" &&
          shareholders[shareholderID]
        ) {
          shareholders[shareholderID].grants.push(grant.id);
        }

        return res(ctx.json(grant));
      }
    ),

    rest.post<User>("/user/new", (req, res, ctx) => {
      const { email, name } = req.body;
      if (!!users[email]) {
        console.warn("User already exists");
        return res(ctx.status(400));
      }

      users[email] = {
        email,
        name,
      };

      return res(ctx.json(req.body));
    }),

    rest.get("/grants", (req, res, ctx) => {
      return res(ctx.json(grants));
    }),

    rest.get("/shareholders", (req, res, ctx) => {
      return res(ctx.json(shareholders));
    }),

    rest.get("/company", (req, res, ctx) => {
      return res(ctx.json(company));
    }),

    rest.post<Shareholder>(
      "/shareholder/:shareholderID/edit",
      (req, res, ctx) => {
        const { id, name, group } = req.body;
        if (shareholders[id]) {
          shareholders[id].group = group;
          shareholders[id].name = name;
        }

        res(ctx.json(shareholders[id]));
      }
    ),
  ];
}
