import React from "react";
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
  indexRoute: { component: Page43 },
  childRoutes: [
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
      component: Page43
    }
  ]
};
