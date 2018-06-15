import React from "react";
import Page70 from "./Page70";
import Page43 from "./Page43";
import HomePage from "./HomePage";
import Page36 from "./Page36";

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
  indexRoute: { component: Page70 },
  childRoutes: [
    {
      path: "/mag-01",
      name: "/mag-01",
      component: Page70
    },
    {
      path: "/bob-cards",
      name: "/bob-cards",
      component: Page43
    },
    {
      path: "/home",
      name: "/home",
      component: HomePage
    },
    {
      path: "/new-page",
      name: "/new-page",
      component: Page36
    },
    {
      path: "*",
      name: "notfound",
      component: Page70
    }
  ]
};
