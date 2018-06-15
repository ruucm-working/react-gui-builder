import React from "react";
import Page86 from "./Page86";
import Page36 from "./Page36";
import HomePage from "./HomePage";
import Page43 from "./Page43";

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default {
  path: "/",
  component: App,
  indexRoute: { component: Page86 },
  childRoutes: [
    {
      path: "/mag-01",
      name: "/mag-01",
      component: Page86
    },
    {
      path: "/new-page",
      name: "/new-page",
      component: Page36
    },
    {
      path: "/home",
      name: "/home",
      component: HomePage
    },
    {
      path: "/bob-cards",
      name: "/bob-cards",
      component: Page43
    },
    {
      path: "*",
      name: "notfound",
      component: Page86
    }
  ]
};
