# Structor's User Guide

* [Getting Started](https://github.com/ipselon/structor/blob/master/docs#getting-started)
* [Integrating with Create React App](https://github.com/ipselon/structor/blob/master/docs/integrating-with-create-react-app.md)
* [Designing UI](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#designing-ui)
    * [A component model](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#a-component-model)
    * [Combine and modify component models](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#combine-and-modify-component-models)
       * [How to select a component](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#how-to-select-a-component)
       * [How to paste new component from library](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#how-to-paste-new-component-from-library)
       * [How to cut, copy and paste components](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#how-to-cut-copy-and-paste-components)
    * [Navigation through pages](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#navigation-through-pages)
* [Working with code](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#working-with-code)
    * [Dev environment](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#dev-environment)
    * [The code structure](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#the-code-structure)
    * [Component library](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#component-library)
       * [React components in library](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#react-components-in-library)
       * [Redux containers in library](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#redux-containers-in-library)
       * [Component default models](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#component-default-models)
    * [Generating the source code](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#generating-the-source-code)
       * [React component scaffold](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#react-component-scaffold)
       * [Redux container scaffold](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#redux-container-scaffold)
    * [Troubleshooting](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#troubleshooting)
* [Structor Market](https://github.com/ipselon/structor/blob/master/docs/structor-market.md#structor-market)
    * [Extracting and publishing components presets](https://github.com/ipselon/structor/blob/master/docs/structor-market.md#extracting-and-publishing-components-presets)
    * [Extending existing presets on the market](https://github.com/ipselon/structor/blob/master/docs/structor-market.md#extending-existing-presets-on-the-market)
* Exporting
    * Export pages
    * Export application

## Integration with Create React App

In case you missed, Structor does not depend on any starter/seed/boilerplate project. 
Instead it can be integrated with any other project. But there is a requirement to the structure of the source code.

> **Note** Structor uses a self-contained structure for React/Redux components. 
You may learn more about this structure from the [Working with code](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#working-with-code) chapter of the Structor's User Guide. 
And if you are going to use the source code generators in Structor or install presets of components from Structor Market, 
you should use the recommended source code structure.

An integration point with a project is a root directory of the source code. 
Webpack 2 in the Structor's guts wants to know where all files are and how they are related to each other. 

That's why Structor is asking you about the source root directory during the installation, 
and then it puts the name of directory into `resolve.modules` setting in Structor's Webpack config.
 
Having such information Webpack is able to resolve global paths in imports. 
And we can instead of `../../components/Button` path use this `components/Button`.

CRA is using Webpack for compiling and building the application too, 
so we have to make `resolve.modules` consistent in CRA and Structor.
As you may know, it's not possible to change Webpack's config in CRA manually. 
But there is a way to do that through the `NODE_PATH` environment variable.   

From this point I suggest to run a brief tutorial 
where we will learn how to build a simple component in Structor, and then import this component into our CRA project. 

### Installation and creating an app

First of all we need to install `create-react-app` globally:
```
npm install -g create-react-app
```

Then create a new app:
```
create-react-app my-notes 
cd my-notes
```

This will generate initial project structure in `my-notes`. 
> You may learn more about project structure from [Getting Started](https://github.com/facebookincubator/create-react-app#getting-started) of CRA documentation.

Now install Structor:
```
npm install structor
```
And when the prompt is appeared, type `src` as a directory name:

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-prompt.png" />
</p>

### Set environment

Here we need to set `NODE_PATH` variable. The best way to do this is to use `cross-env` utility.
Install `cross-env`:
```
npm install -D cross-env
```
Then just edit the `start` script line in `package.json` file:
```
"scripts": {
  "start": "cross-env NODE_PATH=src react-scripts start"
}
```
 
### Create a React component

Run Structor...
```
npm run structor
```

... and open browser with address `localhost:2222/structor`.
 
Structor distribution does not ship with any component presets. 
So, we are going to install some presets from Structor Market.
 
Click on the plus icon in left vertical toolbar and find `Install` button on the appeared panel.

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-install-button.png" />
</p>

Here we can see the marketplace from which we should install `mui-next-spkg` components preset.

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-market.png" />
</p>
 
We are not going to create a prototype of a new component in this tutorial, 
instead we just select the page with the already prepared prototype of our new component.

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-open-page.png" />
</p>

If we try to click somewhere on the page we can see that we can select components on the page and somehow manipulate them. 
This tutorial is not intended to teach how to create UI in Structor, but if you want to learn about this please read the [Getting Started](https://github.com/ipselon/structor/blob/master/docs#getting-started) chapter of the Structor's User Guide.   

Now we need to select a root element of our new React component on the page. 
Click on the code icon in the left vertical toolbar and find `ThemeProvider` component in the bottom tree view.

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-treeview.png" />
</p>

Keeping `ThemeProvider` selected, find and click on the `New Component` button in the top toolbar. 
Here we should choose what type of component we want to generate. Choose a `react-component` generator.

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-generators.png" />
</p>

On the first page of the generator wizard type `MyNotes` in the name field. And type `Tutorial` in the namespace field.

> To learn more about the structure of the generated source code please read the [Working with code](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#working-with-code) chapter of the Structor's User Guide.

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-component-name.png" />
</p>

Do not change any options in the following steps of the wizard. Just click on `Install component` in the last step.

Now we will see that we have `MyNotes` component instead of `ThemeProvider` on the page.
 
At this point we should change the components source code to make it functional. 

Open the `<PROJECT_DIR>/src/modules/Tutorial/components/MyNotes/index.js` file and make changes as it is shown below:

```javascript
/**
 *
 * MyNotes
 *
 */

import React, { Component } from 'react';

import {
  ThemeProvider,
  LayoutContainer,
  LayoutItem,
  TextField,
  Button
} from 'modules/MUI';
import { DataList } from 'modules/DataAware';

const style = {textAlign: 'center'};
const style1 = {
  width: '50em',
  padding: '2em 1em',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#e8d8d8'
};
const style2 = {height: '22em', overflow: 'auto'};
const style3 = {
  borderLeftStyle: 'solid',
  borderLeftWidth: '1px',
  borderLeftColor: '#e8d8d8'
};
const style4 = {height: '200px', width: '100%'};
const style5 = {width: '100%'};
const style6 = {width: '100%'};
const style7 = {width: '100%'};

const newNote = {primaryText: 'New', secondaryText: 'New text'};
let indexCounter = 0;

class MyNotes extends Component {
  constructor (props) {
    super(props);
    this.handleSelectNote = this.handleSelectNote.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleSaveNote = this.handleSaveNote.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.state = {
      notes: [],
      editNote: Object.assign({}, newNote),
    };
  }

  handleSelectNote (id, primaryText, secondaryText) {
    this.setState({editNote: {id, primaryText, secondaryText}});
  }

  handleAddNote () {
    this.setState({editNote: Object.assign({}, newNote)});
  }

  handleDeleteNote () {
    const {editNote, notes} = this.state;
    if (editNote && editNote.id > 0) {
      let newNotes = [].concat(notes);
      const foundIndex = newNotes.findIndex(i => i.id === editNote.id);
      if (foundIndex >= 0) {
        newNotes.splice(foundIndex, 1);
        this.setState({notes: newNotes, editNote: Object.assign({}, newNote)});
      }
    }
  }

  handleSaveNote () {
    const {editNote, notes} = this.state;
    if (editNote) {
      let newNotes = [].concat(notes);
      if (editNote.id > 0) {
        const foundIndex = newNotes.findIndex(i => i.id === editNote.id);
        if (foundIndex >= 0) {
          newNotes[foundIndex] = Object.assign({}, editNote);
        }
      } else {
        newNotes.push(Object.assign({}, editNote, {id: ++indexCounter}));
      }
      this.setState({notes: newNotes, editNote: Object.assign({}, newNote)});
    }
  }

  handleChangeTitle (e) {
    this.setState({
      editNote: Object.assign({}, this.state.editNote, {primaryText: e.target.value})
    });
  }

  handleChangeText (e) {
    this.setState({
      editNote: Object.assign({}, this.state.editNote, {secondaryText: e.target.value})
    });
  }

  render () {
    const {notes, editNote} = this.state;
    const {primaryText, secondaryText} = editNote;
    return (
      <ThemeProvider>

        <h3 style={style}><span>My Notes</span></h3>

        <div style={style1}>
          <LayoutContainer gutter={24}>
            <LayoutItem xs={6}>
              <div style={style2}>
                <DataList
                  data={notes}
                  onSelect={this.handleSelectNote}
                />
              </div>
            </LayoutItem>
            <LayoutItem xs={6} style={style3}>
              <div style={style4}>
                <TextField
                  label="Title"
                  value={primaryText}
                  onChange={this.handleChangeTitle}
                />
                <TextField
                  label="Text"
                  multiline={true}
                  rows={4}
                  value={secondaryText}
                  onChange={this.handleChangeText}
                />
              </div>
              <LayoutContainer gutter={16} justify="center">
                <LayoutItem xs={4}>
                  <Button
                    raised={true}
                    primary={true}
                    style={style5}
                    disabled={!editNote.id}
                    onClick={this.handleAddNote}
                  >
                    <span>Add</span>
                  </Button>
                </LayoutItem>
                <LayoutItem xs={4}>
                  <Button
                    raised={true}
                    accent={true}
                    style={style6}
                    disabled={!editNote.id}
                    onClick={this.handleDeleteNote}
                  >
                    <span>Delete</span>
                  </Button>
                </LayoutItem>
                <LayoutItem xs={4}>
                  <Button
                    raised={true}
                    primary={true}
                    style={style7}
                    onClick={this.handleSaveNote}
                  >
                    <span>Save</span>
                  </Button>
                </LayoutItem>
              </LayoutContainer>
            </LayoutItem>
          </LayoutContainer>
        </div>

      </ThemeProvider>
    );
  }
}

export default MyNotes;

```

The changes should be applied by Webpack Dev Server automatically, 
if not, please reload page by clicking on the refresh icon in the left vertical toolbar.
 
Now we can try component in live preview mode. Click on the hand icon in the left vertical toolbar.
 
<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-livepreview.png" />
</p>

### Import new component into the application

It's time to inject our component into application and run it by CRA.

Open `App.js` file in `<PROJECT_DIR>/src` directory and add `MyNotes` component as it is shown below:

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { MyNotes } from 'modules/Tutorial';

class App extends Component {
  render () {
    return (
      <div>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to React</h2>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <MyNotes />
        </div>
      </div>
    );
  }
}

export default App;
```

### Run application

Run application from project directory:

```
npm start
```

In the browser window you should see the following:

<p align="center">
  <img width="60%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/integrate-with-cra-finish.png" />
</p>

If you encountered some issues please add their explanation in the Structor's repo. 
