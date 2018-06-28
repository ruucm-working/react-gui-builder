import React from "react";
import Page79 from "./Page79";
import Page77 from "./Page77";
import Page128 from "./Page128";

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
  indexRoute: { component: Page79 },
  childRoutes: [
    {
      path: "/home",
      name: "/home",
      component: Page79
    },
    {
      path: "/example-01",
      name: "/example-01",
      component: Page77
    },
    {
      path: "/example-02",
      name: "/example-02",
      component: Page128
    },
    {
      path: "*",
      name: "notfound",
      component: Page79
    }
  ]
};
