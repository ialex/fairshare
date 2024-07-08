import React from "react";
import { render, screen } from "@testing-library/react";
import { getTestRouter, server, ThemeWrapper } from "../testutils";
import { SharePricePage } from "./Shareprice";
import { Route, Routes } from "react-router";
import { getHandlers } from "../handlers";
import userEvent from "@testing-library/user-event";

describe("SharePricePage", () => {
  it("should show a sumamry of shares", async () => {
    const Router = getTestRouter("/shareprice");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
        },
        shareprice: {
          common: 1,
          preferred: 1,
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/shareprice" element={<SharePricePage />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    await screen.findByText(/Update Share Price/);

    const commonSharePriceField = screen.getByLabelText("Common Share Price");
    await userEvent.type(commonSharePriceField, "5");
    expect(commonSharePriceField).toHaveValue(5);

    const preferredSharePriceField = screen.getByLabelText(
      "Preferred Share Price"
    );
    await userEvent.type(preferredSharePriceField, "10");
    expect(preferredSharePriceField).toHaveValue(10);
  });
});
