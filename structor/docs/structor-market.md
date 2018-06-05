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

## Structor Market

If you have not tried to install component presets from Structor Market gallery yet, 
please go through [Getting Started](https://github.com/ipselon/structor/blob/master/docs#getting-started) tutorial to feel how it works.
 
When Structor opens the Structor Market gallery it reads an `index.json` file in [structor-market](https://github.com/ipselon/structor-market) repo 
where all available repos with components presets are listed.

But how to create a repository with components presets?

### Extracting and publishing components presets

Stuctor has a convenient mechanism for sharing components presets between projects. 
Open the library panel in Structor's workspace and find `Extract` button at the top of the panel.
 
<p align="center">
    <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-extract-button.png" />
</p>
 
After clicking on this button you will be prompted to choose namespaces and pages you want to extract.

<p align="center">
    <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-select-to-extract.png" />
</p>

In the next step of the wizard Structor is discovering all components in selected namespaces and pages.

>__Note:__ The only one restriction for the extraction is to use components only from project's `modules` directory.
Simply saying, extracted components, component models or pages should not contain components out of any namespace. 
Read detailed explanation of what is a namespace in [The code structure](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#the-code-structure) chapter.  

Structor genuinely investigates how components are linked with each other and shows what namespaces will be additionally added into the package. 
If you see errors which were not explained in this section please create an issue in Structor's repo. 

Here you have to enter the absolute path of a directory where package's files will be extracted and click on `Extract namespaces` button. 

<p align="center">
    <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-enter-dirpath.png" />
</p>
 
Once files were successfully extracted you may find them in specified directory. 
Now we can install this package into another project right from the local directory. 

If you want to share your package on Structor Market you can create a new repo on GitHub and push there the directory content as it is. 
Then just make changes in `index.json` in [structor-market](https://github.com/ipselon/structor-market) repo with the URL of your repository. 
 
### Extending existing presets on the market

Creating own package is not reasonable if you are going to make an extension of components presets in some package.
 
So I'd like to suggest the following steps to provide the package extension:
 * Fork a repo with Structor's presets and clone it to the local folder;
 * Install Structor into an empty folder:
    * Init `package.json` by command `npm -y init`;
    * Install Structor by command: `install structor`;
 * Run Structor and open browser with Structor's workspace;
 * Go to the Structor Market gallery; 
 * Choose installation from the local dir;
 
 <p align="center">
     <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-install-from-dir.png" />
 </p>
 
 * Enter the absolute path to the local folder of the cloned repo at the first step;
 
 <p align="center">
     <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-install-from-dir-path.png" />
 </p>
 
 * Implement some new components/features/models;
 * Extract namespaces with your changes into the folder of cloned repo;
 * Push changes in cloned repo on GitHub;
 * Make a PR to the main repo from your fork.
