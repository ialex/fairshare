import React from "react";
import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import {
  CompanyStep,
  OnboardingContext,
  OnboardingFields,
  ShareholderGrantsStep,
  ShareholdersStep,
  signupReducer,
  UserStep,
} from "./Onboarding";
import { Navigate, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { getTestRouter, ThemeWrapper } from "../testutils";

const defaultOnboardingState = {
  userName: "",
  email: "",
  companyName: "",
  shareholders: {},
  grants: {},
};

const Page = ({
  initialState = defaultOnboardingState,
}: {
  initialState?: OnboardingFields;
}) => {
  const [state, dispatch] = React.useReducer(signupReducer, initialState);

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="user" replace={true} />} />
        <Route path="user" element={<UserStep />} />
        <Route path="company" element={<CompanyStep />} />
        <Route path="shareholders" element={<ShareholdersStep />} />
        <Route
          path="grants"
          element={<Navigate to={`/grants/0`} replace={true} />}
        />
        <Route
          path="grants/:shareholderID"
          element={<ShareholderGrantsStep />}
        />
        <Route path="done" element={<div />} />
      </Routes>
    </OnboardingContext.Provider>
  );
};

describe("Onboarding", () => {
  it("should allow configuring user details", async () => {
    const Router = getTestRouter("/");
    render(
      <Router>
        <Page />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const nameField = screen.getByRole("textbox", { name: /who is setting/ });
    await userEvent.click(nameField)
    await userEvent.type(nameField, "Terry");
    expect(nameField).toHaveValue("Terry");

    const emailField = screen.getByRole("textbox", { name: /email/ });
    await userEvent.click(emailField)
    await userEvent.type(emailField, "great@email.com");
    expect(emailField).toHaveValue("great@email.com");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await userEvent.click(nextButton);
    expect(nameField).not.toBeInTheDocument();
  });

  it("should allow configuring company", async () => {
    const Router = getTestRouter("/company");
    render(
      <Router>
        <Page />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const companyNameField = screen.getByRole("textbox", {
      name: /company are we/,
    });
    await userEvent.type(companyNameField, "Admiral");
    expect(companyNameField).toHaveValue("Admiral");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await userEvent.click(nextButton);
    expect(companyNameField).not.toBeInTheDocument();
  });

  it("should allow configuring shareholders", async () => {
    const Router = getTestRouter("/shareholders");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shareholders: {
              "0": { name: "Jenn", group: "founder", grants: [], id: 0 },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    expect(screen.getByText("Jenn")).toBeInTheDocument();
    expect(screen.queryByText("Anne")).toBeNull();

    const addShareholdersButton = screen.getByRole("button", {
      name: "Add Shareholder",
    });
    await userEvent.click(addShareholdersButton);

    let newShareholderNameField = screen.getByRole("textbox");
    let groupPicker = screen.getByRole("combobox");
    let createButton = screen.getByRole("button", { name: "Create" });
    await waitFor(() => {
      expect(newShareholderNameField).toBeVisible();
    });
    await userEvent.click(newShareholderNameField);
    await userEvent.paste("Anne");
    await userEvent.selectOptions(groupPicker, "founder");
    await userEvent.click(createButton);

    await waitForElementToBeRemoved(newShareholderNameField)
    expect(screen.getByText("Anne")).toBeInTheDocument();

    await userEvent.click(addShareholdersButton);
    newShareholderNameField = screen.getByRole("textbox");
    groupPicker = screen.getByRole("combobox");
    createButton = screen.getByRole("button", { name: "Create" });
    await waitFor(() => {
      expect(newShareholderNameField).toBeVisible();
    });
    expect(newShareholderNameField).toHaveValue("");

    await userEvent.click(newShareholderNameField);
    await userEvent.paste("Byron");
    await userEvent.selectOptions(groupPicker, "employee");
    await userEvent.click(createButton);

    expect(screen.getByText("Byron")).toBeInTheDocument();
  });

  it("should allow for configuring shareholder grants", async () => {
    const Router = getTestRouter("/grants");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shareholders: {
              0: { name: "Jenn", group: "founder", grants: [1], id: 0 },
              1: { name: "Aaron", group: "employee", grants: [], id: 1 },
              2: { name: "Sam", group: "investor", grants: [], id: 2 },
            },
            grants: {
              1: {
                id: 1,
                name: "Initial issuance",
                amount: 1000,
                issued: Date.now().toLocaleString(),
                type: "common",
              },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    expect(screen.getByText(/Jenn/)).toBeInTheDocument();
    expect(screen.getByText("Initial issuance")).toBeInTheDocument();

    const addGrantButton = screen.getByRole("button", { name: /Add Grant/ });
    await userEvent.click(addGrantButton);

    let grantNameInput = screen.getByTestId("grant-name");
    let grantAmountInput = screen.getByTestId("grant-amount");
    let grantDateInput = screen.getByTestId("grant-issued");

    await waitFor(() => {
      expect(grantNameInput).toBeVisible();
    });

    await userEvent.click(grantNameInput);
    await userEvent.paste("2020 Incentive");
    await userEvent.click(grantAmountInput);
    await userEvent.paste("2000");
    await userEvent.click(grantDateInput);
    await userEvent.paste(Date.now().toLocaleString());

    const saveButton = screen.getByRole("button", { name: /Save/ });
    await userEvent.click(saveButton);

    expect(screen.getByText("2020 Incentive")).toBeInTheDocument();

    let nextButton = screen.getByRole("link", { name: /Next/ });
    await userEvent.click(nextButton);

    await screen.findAllByText(/Aaron/);
    expect(screen.getByText(/No grants to show/)).toBeInTheDocument();

    await userEvent.click(addGrantButton);

    expect(grantNameInput).toHaveValue("");
    await userEvent.click(grantNameInput);
    await userEvent.paste("Options conversion");
    await userEvent.click(grantAmountInput);
    await userEvent.paste("100");
    await userEvent.click(grantDateInput);
    await userEvent.paste(Date.now().toLocaleString());

    await userEvent.click(saveButton);

    expect(screen.getByText("Options conversion")).toBeInTheDocument();

    nextButton = screen.getByRole("link", { name: /Next/ });
    await userEvent.click(nextButton);

    await screen.findAllByText(/Sam/);
    expect(screen.getByText(/No grants to show/)).toBeInTheDocument();

    await userEvent.click(addGrantButton);

    expect(grantNameInput).toHaveValue("");
    await userEvent.click(grantNameInput);
    await userEvent.paste("Series A Purchase");
    await userEvent.click(grantAmountInput);
    // Something is wrong with this input *hint*
    // userEvent.paste(grantAmountInput, '800')
    await userEvent.click(grantNameInput);
    await userEvent.paste("12/12/2020");

    await userEvent.click(saveButton);

    const textIndicator = screen.getByText(/What grants does/);
    expect(textIndicator).toBeInTheDocument();
    await userEvent.click(nextButton);
    expect(textIndicator).not.toBeInTheDocument();
  }, 10000);

  it.todo("should persist onboard config");
});
