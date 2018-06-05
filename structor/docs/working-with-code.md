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

## Working with code

This chapter assumes that you have a basic knowledge of React, Redux and Redux Saga, Webpack and Hot Reloading. 

Also, it assumes that you understand what is a component model in terms of Structor. 
If not, please read [Designing UI](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#designing-ui) chapter of this guide. 
  
During the installation Structor is asking to provide a directory name where the source code of all components is 
or will be in the project. 
If specified folder is missing Structor will create it. 
It is suggested to use a commonly used [component/container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 
file structure in this folder.

If you are not going to make design in Structor and generate scaffolds for new React components, you may not 
follow the rules for the source code structure which is described here. 
Although, by using Structor only as a playground for React components, just like React Storybook, 
you are cutting out the major capabilities of Structor.

### Dev environment

Structor runs own Express server on 2222 port. However we can set another port using `p` option, for example: 
`npm run structor -p 3443`
The server utilises Webpack's Dev and Hot middlewares to make a hot reloading available in the Structor's workspace.

As you might have guessed, there should be a Webpack configuration somewhere. 
Yes, you can find the webpack config in the metadata folder `.structor/webpack.base.js`.
 
This config file is a basic configuration for Webpack dev server which exposes an endpoint for Structor's workspace. 
Accordingly there is another configuration file which plays a role of an extension for basic config: `.structor/webpack.app.js`. 
So, if you want to customise a webpack config, do it in `webpack.app.js` file - it will not be updated 
when you install a new version of Structor.

We may consider such a development environment as an isolated Web application. 
But there are a few files which have references to the project's source code: 
`components.js`, `reducers.js` and `sagas.js` files in `.structor/app` folder. 

If Structor wants to work with Redux containers it should have own Redux state configuration. 
`.structor/app/store.js` file is a Redux state configuration utility, 
and `reducers.js` and `sagas.js` are index files for reducers and sagas in the project.

There is one more file in `.structor/app` folder - `components.js` file which we discuss in the next section.

But before we can proceed, we should bear in mind that files: 
`components.js`, `reducers.js` and `sagas.js` are connecting points which connect Structor with project's components.

Taking in account all above, we can say that Stuctor runs as a standalone application. 
And it does not depend on any seed or boilerplate project. It can be utilized with any existing React Web application project. 
However the only one requirement is to use the Webpack version > 2.2.x.   

### The code structure

As we already know, it is recommended to use a component/container file structure in a React application. 
Moreover, each component will be encapsulated in a self-contained structure. You may read about such structure in 
[Three Rules For Structuring (Redux) Applications](https://jaysoo.ca/2016/02/28/organizing-redux-application/) article 
or read docs for [React Boilerpate](https://github.com/react-boilerplate/react-boilerplate) project which is using a similar architecture.
 
A self-contained structure may be described by the following schema:
```
components/
    <COMPONENT_NAME>
        index.js - React component
containers/
    <CONTAINER_NAME>
        index.js - Redux container
        actions.js
        constants.js
        reducer.js
        sagas.js
        selectors.js
```

It does not mean that we can not add extra files in there or remove some files, 
the only requirement is to keep files inside of component's folder.

Such structure gives big advantages in extending and refactoring a complex Web application. 
But there is an issue when the application grows bigger - components may have conflicting names.

In this case we should encapsulate conflicting components in namespaces. 
Read [Additional Guidelines For (Redux) Project Structure](https://jaysoo.ca/2016/12/12/additional-guidelines-for-project-structure/) 
article about such an approach. Then our structure will look as following:
```
components/
    <COMPONENT_NAME>
        index.js - React component
containers/
    <CONTAINER_NAME>
        index.js - Redux container
        actions.js
        constants.js
        reducer.js
        sagas.js
        selectors.js
modules/
    <NAMESPACE_NAME>/
        components/
            <COMPONENT_NAME>
                index.js - React component
        containers/
            <CONTAINER_NAME>
                index.js - Redux container
                actions.js
                constants.js
                reducer.js
                sagas.js
                selectors.js
        index.js - namespace components and containers index
        reducer.js - composition of containers reducers in namespace
        sagas.js - composition of containers' sagas in namespace
```

Using this structure for project components is important if we are going to use Structor's generators 
or install component packages from Structor Market.

**Important Note** The source code files should use paths relative to `PROJECT_APP_DIR` folder. 
For example: `import Button from 'components/Button'`. 
This works because Webpack configuration (`.structor/webpack.base.js`) defines `PROJECT_APP_DIR` folder as 
a module in `resolve.modules` settings.

### Component library

Any React component included into `.structor/app/components.js` file appears in `Component Library` panel in the Stuctor's workspace. 
Let's review the format of this file. Below is an initial file content right after the installation.  

```javascript
import {
    Link,
    IndexLink
} from 'react-router';
export {
    Link,
    IndexLink
};
```

As we can see, this is a regular JS file which makes reexporting of components. 

#### React components in library

Let's see how it will look if there a React component is included. 
Assuming that we are using the file structure described above. 

```
components/
    Button
        index.js
```

And the `components.js` file will be:

```javascript
import {
    Link,
    IndexLink
} from 'react-router';
import Button from 'components/Button'; 
export {
    Link,
    IndexLink,
    Button,
};
```

`Component Library` panel will show `Button` component in `Components` group: 

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-library-shows-button.png" />
</p>

***Component in namespace***

But how it will look if we want to add another `Button` component? We can do that using a namespace module. 
See how the file structure should be in this case:
```
components/
    Button/
        index.js
modules/
    mylib/
        components/
            Button/
                index.js
        index.js
```

And `components.js` file is:
```javascript
import {
    Link,
    IndexLink
} from 'react-router';
import Button from 'components/Button';
import * as mylib from 'modules/mylib';
export {
    Link,
    IndexLink,
    Button,
    mylib,
};
```

Additionally, we need to review the content of namespace's `index.js` file (`modules/mylib/index.js`).
```javascript
import Button from './components/Button';              
export {
    Button
};
```
 
As we can see, it has the same structure as `components.js` file has. 
But how `Component Library` panel will show two `Button` components?
Please find it on the screenshot below:

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-library-shows-two-buttons.png" />
</p>

**Note** It is required to use described format of `component.js` and namespace's `index.js` files - 
they are parsed by Structor in order to discover components for the library. 
 
#### Redux containers in library

Including Redux containers into library has a few additional steps. 
We need to modify `components.js` file along with `reducers.js` and `sagas.js` in `.structor/app` folder.

Let's start from Redux container which is not in any namespace.

```
containers/
    SmartPanel/
        index.js
        actions.js
        constants.js
        reducer.js
        sagas.js
        selectors.js
```

Add `SmartPanel` component in `components.js` file in the same way as it was for React component. 
The only difference is that path to the component should start with `containers` folder.
 
```javascript
import {
    Link,
    IndexLink
} from 'react-router';
import SmartPanel from 'containers/SmartPanel'; 
export {
    Link,
    IndexLink,
    SmartPanel,
};
```

After Structor discovered that a new record appeared we will see `SmartPanel` in `Components` group in `Component Library` panel.
 
<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-library-shows-container-1.png" />
</p> 

Now we need to inject container's reducer and sagas by editing `.structor/app/reducers.js` and `.structor/app/sagas.js`.

Changes in `reducers.js` file:

```javascript
import smartPanelReducer from 'containers/SmartPanel/reducer.js';
export default { smartPanel: smartPanelReducer };
```

And `sagas.js` should be:
```javascript
import SmartPanelSagas from 'containers/SmartPanel/sagas.js';
export default [...SmartPanelSagas];
```

From now `SmartPanel` reducer is connected to the global state. As a reminder, Structor has own Redux state instance.

***Container in namespace***

It will be a bit more complicated to add Redux container from a namespace. As you already noticed, a namespace uses own index file for components.
Similarly the namespace has own `sagas.js` and `reducer.js` files. Let's review them first in order to understand why we need them.

Namespace's `sagas.js` file is just an index file which gathers all sagas in the namespace and expose it as an array.
```javascript
import SmartPanelSagas from './containers/SmartPanel/sagas.js';           
export default [
    ...SmartPanelSagas
];
```

On contrary, a namespace's `reducer.js` file provides a combination of reducers of the namespace, 
which is injected as a single endpoint in the global Redux state. 
It means that reducer of each container will be injected into a namespace state, 
then the namespace's state will be injected into the global state. It looks like the following schema:
```
globalState -> namespaceState -> containerState
```

So, namespace's `reducer.js` file will include the following:
```javascript
import { combineReducers } from 'redux';
import smartPanelReducer from './containers/SmartPanel/reducer.js';
                
export default combineReducers({
    smartPanel: smartPanelReducer
});
```

Consequently, containers in namespace should select state from namespace endpoint rather than directly from global state. 
For example, we can create a selector in our `SmartPanel` container like this:
```javascript
const selectSmartpanel = () => (state) => state.mylib.smartPanel;
```

Adding namespace's reducer and sagas is similar to the adding a container without namespace, 
except that we are adding the namespace reducer in this case.

`.structor/app/reducers.js`:
```javascript
import smartPanelReducer from 'containers/SmartPanel/reducer.js';
import mylibReducer from 'modules/mylib/reducer.js';
export default {
    smartPanel: smartPanelReducer,
    mylib: mylibReducer
};
```

`.structor/app/sagas.js`:
```javascript
import SmartPanelSagas from 'containers/SmartPanel/sagas.js';
import mylibSagas from 'modules/mylib/sagas.js';
export default [
    ...SmartPanelSagas,
    ...mylibSagas
];
```

#### Component default models

We already discussed in [Designing UI](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#designing-ui) 
chapter how Structor renders pages with components in its workspace. 
And we mentioned in [A component model](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#a-component-model) 
section that there should be a model definition for each component in the library.
   
Such definitions, or it's more accurate to say metadata, of component models are located in `.structor/defaults` folder.
Here we can find JSON files for each component accordingly. Models for namespaces are in nested folders.

```
.structor/
   defaults/
      Button.json
      SmartPanel.json
      mylib/
         Button.json
         SmartPanel.json
```

Don't worry about adding model files for components you added manually - 
Structor will render your component with the default model definition. 
But if you want to create more models in the library you always can create it easily by `Save Model` action in the Structor's workspace.

### Generating the source code

In previous section we learned about what the file structure is recommended to use with Structor. 

Although, you may not follow that rules if you are not going to generate new components by source code 
generators or install new components from Structor Market.

But if you decide to give a shot for Srtuctor's generators, this section will help you understand this powerful feature of Stuctor.

Frankly saying, the code generation makes life easier a lot. 
Of course, it is not suggested that generator will generate ready to go component from the scratch. 
But generator is able to generate scaffolds for all needed files. Especially this is true for Redux container files.

Structor ships with a couple generators for React component and Redux container. 
We can find generators code files in `.structor/gengine/scaffolds`. 

Hopefully the number of generators will grow in the future due to the simplicity of creating them.
Generator uses `lodash` template for generating the output files, and it's easy to change the generator output code right in the template.
Find generator's templates in folder: `.structor/gengine/scaffolds/<generator name>/templates`.


#### React component scaffold

Before we start let's understand why Structor makes code generation is extremely useful.

As we already know, we can easily combine any amount of components in the Structor's workspace. 
We can modify components look and feel right on the page. But we don't get a real source code of a component in the result. 
That's why we need a generator that is capable to generate the source code of the component.
  
A `react-component` generator takes the model of the selected component and produces the source code for React 
component with all nested components inside. Moreover, the source code will include all properties and styles as well.
 
This generator is smart enough to use correct paths to other components in imports, 
and even resolves conflicting names from different namespaces.

Select any component on the page and click on `Generate Component` button in the top toolbar. 

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-generate-component-button.png" />
</p>

We will see a generator wizard page. Here we should choose what component we want to have in the result. 
As we are going to generate simple React component, let's choose `react-component` generator.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-generator-list.png" />
</p>

In the next step we should enter the name of our future component. Also, there is the possibility to specify a component's namespace.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-enter-component-name.png" />
</p>

Then generator asks about additional options which will tell the generator what you want to see in the generated code.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-generator-options.png" />
</p>

* `Select type of component` - that will tell if we want to inherit Pure component or not.
* `Add default constructor to the source code` - include in the code a constructor
* `Inject children into the source code of the component` - you may not include children into the source code, 
in this case we will get an empty component with the same model. This is useful if you want to create kind of a layout grid component for Stuctor.
* `Add an example of the property declaration in the source code` - adds example of property declaration in the React component.
 
The next step will show us all source code files which were generated or modified in order to respect 
dependencies for Webpack compiler. Here you might see that generator made exactly the same changes in `.structor/app/components.js` 
file as we have seen in previous section. Also, there is additional JSON file for a new component model.
  
<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-component-preview.png" />
</p>

Now click `Install component` button to write the code into project's file structure.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-library-shows-new.png" />
</p>

#### Redux container scaffold

The same result we would get in case we chose `redux-container` generator. 
Additionally, you'll be prompted to enter a reducer key name property under which container's reducer 
will be injected into the global store or the namespace's store in case you specify the namespace.
Also there will be a way more generated files at the preview stage.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-container-preview.png" />
</p>

**Note** All generated components or containers will appear in corresponding groups in `Component Library` pane in the Stuctor's workspace. 

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/source-code-library-shows-container.png" />
</p>

### Troubleshooting

In case you see that Structor is loading a page too long, or there is an error in the console which tells that Structor endpoint is not found (404).
Then you can switch Structor to the verbose mode and see the Webpack output in the terminal console. 

Find in `package.json` file a line in `scripts` section with name: `structor` and change it to the following:
```
"structor": "structor -v"
```

If you need to change the port of the Structor's server, you may set the `p` option:
```
"structor": "structor -p 3443"
```
