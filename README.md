### React GUI Builder

# run react-gui-builder

```
npm install && npm run dev
```


# modify react-gui-builder

```
cd react-gui-builder && npm install && npm run build-client-dev
```

# Export App

Press Export App at 'list of pages' pannel,

then find result app using
```
npm run start
```

# Folder Structure
.
├── .structor               # GUI Builder(structor) Settings (http://localhost:2223)
│   ├── modules             # modules made by GUI Builder
│   ├── webpack.app.js      # webpack settings for the GUI Builder (http://localhost:2223)
│   └── webpack.base.js     # webpack settings for the GUI Builder (http://localhost:2223)
├── app                     # React App using GUI Builder modules (http://localhost:3000)
│   ├── modules             # modules made by GUI Builder
│   └── appStyle.js         # Global App Style
├── build                   # build files  
├── internals               # webpack settings for the React App (http://localhost:3000)
├── server
├── structor                # GUI Builder App (structor)
├── .gitignore
├── deploy.sh               # deploy script (yarn deploy)
├── package.json
└── README.md
