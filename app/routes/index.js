import React from "react";
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
  indexRoute: { component: HomePage },
  childRoutes: [
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
      component: HomePage
    }
  ]
};
