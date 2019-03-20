# Cards Editor
Cards Editor is an open source software based on Electron and React. Its goal is firstly to offer an easy and intuitive way to create and customize cards, secondly to export them in pdf format to be printed. Installers are currently availables for Linux and Windows.

## Getting started

### Download release
You can find installers for Windows and Linux in project's releases.

[`latest (0.2.1-follow-up-2)`](https://github.com/paullaffitte/cards-editor/releases/latest)

### Build
Install the dependencies and build.
```yarn && yarn release```
Installers can then be found at `./dist`.

### Developpement mode
To enter in developpment mode, you need dependencies to be installed. Then you can start react and electron. Be careful, react can takes time to start, so you will propably need to refresh the page when it's ready, or restarting electron.

When you start react, it opens a tab in your main browser, you can close it. It will display some errors, you can ignore them, it's because the editor is not meant to be runned outside of electron.

``` bash
# Install dependencies
yarn

# Start react
yarn start

# Start electron
yarn electron
```

### package.json scripts
#### React
```bash
# Start the developement react server
yarn start

# Build the react application
yarn build
```

#### Electron
```bash
# Start the developement electron server
yarn electron

# Build the electron application (needs react to be already built)
yarn dist
```

#### Common
```bash
# Build the complete Electron + React application and create installers for windows and linux
yarn release
```

## How to
not available yet.

## Screenshots
not available yet.
