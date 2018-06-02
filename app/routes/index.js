import React from "react";
import Page6 from "./Page6";
import HomePage from "./HomePage";

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
  indexRoute: { component: Page6 },
  childRoutes: [
    {
      path: "/new-page",
      name: "/new-page",
      component: Page6
    },
    {
      path: "/home",
      name: "/home",
      component: HomePage
    },
    {
      path: "*",
      name: "notfound",
      component: Page6
    }
  ]
};
