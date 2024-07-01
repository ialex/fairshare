import React from "react";
import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { getTestRouter, server, ThemeWrapper } from "../testutils";
import { Dashboard } from "./Dashboard";
import { Route, Routes } from "react-router";
import { getHandlers } from "../handlers";
import userEvent from "@testing-library/user-event";

describe("Dashboard", () => {
  it("should show a row for all shareholders", async () => {
    const Router = getTestRouter("/dashboard");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          1: { name: "Tony", grants: [3], group: "employee", id: 1 },
          2: { name: "Tiffany", grants: [4, 5], group: "employee", id: 2 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
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
          3: {
            id: 3,
            name: "Options Conversion 2020",
            amount: 100,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          4: {
            id: 4,
            name: "Options Conversion 2019",
            amount: 90,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          5: {
            id: 5,
            name: "Options Conversion 2020",
            amount: 30,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    await screen.findByText("Tonya");
    expect(screen.getByTestId("shareholder-Tonya-grants")).toHaveTextContent(
      "2"
    );
    expect(screen.getByTestId("shareholder-Tonya-group")).toHaveTextContent(
      "founder"
    );
    expect(screen.getByTestId("shareholder-Tonya-shares")).toHaveTextContent(
      "1500"
    );

    expect(screen.getByTestId("shareholder-Tony-grants")).toHaveTextContent(
      "1"
    );
    expect(screen.getByTestId("shareholder-Tony-group")).toHaveTextContent(
      "employee"
    );
    expect(screen.getByTestId("shareholder-Tony-shares")).toHaveTextContent(
      "100"
    );

    expect(screen.getByTestId("shareholder-Tiffany-grants")).toHaveTextContent(
      "2"
    );
    expect(screen.getByTestId("shareholder-Tiffany-group")).toHaveTextContent(
      "employee"
    );
    expect(screen.getByTestId("shareholder-Tiffany-shares")).toHaveTextContent(
      "120"
    );

    expect(screen.getByTestId("shareholder-Timothy-grants")).toHaveTextContent(
      "1"
    );
    expect(screen.getByTestId("shareholder-Timothy-group")).toHaveTextContent(
      "investor"
    );
    expect(screen.getByTestId("shareholder-Timothy-shares")).toHaveTextContent(
      "500"
    );
  });

  it("should show investors in investors chart", async () => {
    const Router = getTestRouter("/dashboard/investor");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          1: { name: "Tommy", grants: [3], group: "employee", id: 1 },
          2: { name: "Tiffany", grants: [4, 5], group: "employee", id: 2 },
          3: { name: "Timothy", grants: [], group: "investor", id: 3 },
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
          3: {
            id: 3,
            name: "Options Conversion 2020",
            amount: 100,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          4: {
            id: 4,
            name: "Options Conversion 2019",
            amount: 90,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          5: {
            id: 5,
            name: "Options Conversion 2020",
            amount: 30,
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
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const chart = await screen.findByRole("img");
    expect(within(chart).getByText(/Tonya/)).toBeInTheDocument();
    expect(within(chart).getByText(/Tommy/)).toBeInTheDocument();
    expect(within(chart).getByText(/Tiffany/)).toBeInTheDocument();
    expect(within(chart).queryByText(/Timothy/)).toBeNull();
  });

  it("should show groups in groups chart", async () => {
    const Router = getTestRouter("/dashboard/investor");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
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
          6: {
            id: 6,
            name: "Series A Purchase",
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
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const groupsChartButton = await screen.findByRole("link", {
      name: /by group/i,
    });
    await userEvent.click(groupsChartButton);

    const chart = await screen.findByRole("img");
    expect(within(chart).getByText(/founder/)).toBeInTheDocument();
    expect(within(chart).getByText(/investor/)).toBeInTheDocument();
  });

  it("should allow adding new shareholders", async () => {
    const Router = getTestRouter("/dashboard");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const addShareholderButton = await screen.findByRole("button", {
      name: /add shareholder/i,
    });
    await userEvent.click(addShareholderButton);

    const shareholderNameInput = screen.getByRole("textbox");
    const groupCombo = screen.getByRole("combobox");
    const saveButton = screen.getByRole("button", { name: /Save/ });
    await userEvent.click(shareholderNameInput);
    await userEvent.paste("Mike");
    await userEvent.selectOptions(groupCombo, "investor");

    await userEvent.click(saveButton);

    await waitFor(() => expect(shareholderNameInput).not.toBeVisible());
    expect(
      await screen.findByTestId("shareholder-Mike-group")
    ).toHaveTextContent("employee");
  }, 10000);
});
