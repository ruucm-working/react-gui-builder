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
    
## Designing UI
      
### A component model

A component model is a metadata used by Structor, it tells 
how to render a React component and what properties should be applied to the component.
Each model is written in JSON format and have a pretty simple structure:

```json5  
  {
    "type": "Link",
    "props": {
      "to": "/main"
    },
    "children": [
      {
        "type": "span",
        "text": "go to /main"
      }
    ]
  }
```

Where `type` tells which React component should be rendered, `props` - what properties will be applied, 
`children` - an array of nested components.
  
As you may already guessed, placing other models into `children` array gives us a tree of components 
that is rendered on the page.
Adding, removing, replacing models in the tree can be done right in the workspace.

___Note___ You have to select a component on the page before starting any modification of the model. 

In practice, a selecting of some component on the page is the selecting of a model in the tree.
Structor lets us modify any selected model through the tools in the workspace, 
such as: `Component Options` dialog, `Quick Style` panel. 

For example, select a component on the page. 
Then click again on selected component, now you can see and modify `props` in a `Component Options` dialog.
Also, we can open this dialog by clicking on `Edit` button on the top toolbar. 
Find a JSON editor in `Properties` tab in the dialog.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-options-dialog.png" />
</p>

Another way to add or change property in the model is to use the `Quick Style` panel. 
Click on the button with brush icon on the left vertical toolbar. Go to the `Props` tab in the appeared panel. 
There you can add or change properties one by one.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-quick-style-panel.png" />
</p>

Once we changed the properties in the model, Structor applies immediately these changes on the page. 
It does not require any extra compilation or rebuilding of the page.

A different trees of models are encapsulated into pages in terms of Structor's workspace. 
Structor can hold many pages, and their models are placed in one JSON file.
We may find this file in Structor's meta folder here: `.structor/desk/model.json`;

### Combine and modify component models

Structor's workspace lets us combine any amount of models on the page. 
It is suggested to use several ways to combine and modify a page model.
First of all, we have to select a component on the page - this selection should serve as a starting point of a combination. 

#### How to select a component
 
Structor has a few ways to select a component on the page. 

The first, we may see the tree structure of the page by clicking on the button with code sign icon in the left vertical toolbar.
 
Here we can:
* see properties applied to the component,
* edit text right in place, 
* copy, paste, delete, move, replace and etc.

The second, we can see how components are nested in `Breadcrumbs` control on the top toolbar. 
Here we can select any component in the path by clicking on it.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-treeview-panel.png" />
</p>

And of course, we can just click on the component right on the page. 
Useful: the hovering over a component shows the boundaries of the component and its name. 
That helps find components on the page quicker.

#### How to paste new component from library

Where we can find components which can be placed onto the page? There is a library of components. 
Literally, this is a list of models and each of the model can be pasted into the page's tree.

Activate the plus button on the left vertical toolbar. 
Now we can see a panel with groups of components on the left side of the workspace. 
Clicking on the group will show its content.

Initially we can see only two groups of components: `HTML` and `Components`. 
`HTML` group includes all HTML components, and `Components` group includes `Link` and `IndexLink` components 
from React Router.

_Please read in "The code structure" chapter about how components appear in Structor's library,
and how to add own components into the library._

By clicking on an item in the group we are copying the component model into a clipboard. 

___Clipboard___ is a buffer for component models. 
Find a clipboard control on the top toolbar where you can see what components are in the clipboard at this moment.
  
<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-library-panel.png" />
</p>
    
Now we can paste model from clipboard into the page as a sibling or as a child of any selected component, 
or replace it with the clipboard content. 
Just find controls `Before`, `First`, `Last`, `After`, `Replace` on the following screenshot:

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-paste-controls.png" />
</p>
 
Also, here is a convenient way to place a component in the hierarchy - 
a small circle placeholders in page's tree view, clicking by which we can place there a new component.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-treeview-panel-placeholders.png" />
</p>

Additionally, there is one quick way to add new component on the page:
* Make sure that the clipboard is empty (if not just click on close icon on the clipboard control in the top toolbar)
* Select the component on the page
* Click on one of pasting buttons: `Before`, `First`, `Last`, `After`, `Replace` or on placeholders in the tree view.
* Type the name of component in the appeared dialog. And click `Submit`.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-quick-add-dialog.png" />
</p>

**Important** You are able to add new models to the component in the library. 
Just select a component you want to have a new model 
(for example, you changed style property in certain model and want to save it as a template), 
and click on `Save Model` button on the top toolbar. That will lets you to save selected model as different model.
This is very helpful in case you want to share your library models on Structor Market. 
Please read about how to extract the library in "Namespaces" chapter.
 
<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-savemodel-dialog.png" />
</p>

#### How to cut, copy and paste components

As well as we copied components from library we are able to cut or copy any component on the page into the clipboard. 
That will allow us to paste component from clipboard in any other place. 

Find highlighted buttons, which cut and copy components into the clipboard, on the following screenshot:

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-copy-paste-controls.png" />
</p>

Additionally, Structor lets select, copy, cut and paste multiple components on the page. 
To select multiple components we have to press `Ctrl` or `Command` and click on the component. 
Once you selected many components you see that in the top toolbar instead of `Breadcrumbs` control. 

Then you can just click on copy or cut button on the top toolbar. 
All selected component models will be copied into clipboard. 
Clipboard is able to hold not only a single component's model, but multiple models as well.

And now you may paste the clipboard content somewhere else.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-multiple-selection.png" />
</p>

### Navigation through pages

As you already know, the workspace can have many pages. 
Each page in the workspace has own address, and we can navigate between pages.
There is a panel with pages list, where we can switch the current page to another one.

Also, there is a page control on the top toolbar where we can add new pages, change the width of page's viewport, 
and delete the current page.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/design-ui-page-controls.png" />
</p>

As far as the page has the address, we can link it to another page and navigate between pages right in the preview mode. 
Place a `Link` component from React Router somewhere on one page. 
Then open `Props` tab in `Quick Style` panel, and set `to` property value to address of another page. 
Now you may switch workspace to the preview mode and try to navigate to another page by the link.
  
