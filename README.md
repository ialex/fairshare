# Fair Share

Welcome to Admiral! We have pivoted, and now our product is an equity sharing app. We're still in MVP phase, and are excited for our new hires to help build our app.

## Frontend

The frontend of the application is a React application that uses context and React Query to manage state.

You can find documentation for these here:
https://reactjs.org/docs/context.html
https://react-query.tanstack.com/

Importantly, there are two key conepts for React Query: mutations and queries. When you want to update data, you use a mutation. When you're just referencing data, you use a query. 

The application is broken up into a few main areas:

### Styles
We use chakra for our component library. We really like it! Please use it for new UI features.

https://chakra-ui.com/docs/getting-started

### Testing

We use Jest and Testing Library to write our tests. So far we have okay tests, but they're not perfect. We're always looking for improvement, but we do require that new features include tests!

https://jestjs.io/
https://testing-library.com/docs/react-testing-library/intro

### Structure

#### Onboarding
This portion of the app contains components for all of the steps in the onboarding process

#### Dashboard
The dashboard contains company and aggregated metrics which show how ownership is broken down across all shareholders.

#### Shareholder
The ShareholderPage contains data specific to a just a single shareholder, and shows how much equity they have.

Today, the app allows basic create operations but isn't great for updates (or other operations). We need your help to improve this functionality.

## Backend

We're saving server expenses by mocking all network calls using MSW. You don't need to understand what MSW is, other than that we use it to define handlers for outgoing network calls. No servers === no problems.

The behavior of our "backend" is defined by the "handlers" in `handlers.ts`. If you need to make changes or add endpoints, this is where you can do this.

You probably don't need to worry about our database--its just some objects in memory on the user's browers. Its genius, right?

 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Yarn

If you don't have yarn, please install it by running

```
npm install --global yarn
```

## Installing dependencies

Installing dependencies with `yarn` is easy. Simply run it in the base directory without any arguments, and it will get you what you need.

```
yarn
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
