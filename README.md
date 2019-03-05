# Cards Editor
Cards Editor is an open source software based on Electron and React. Its goal is firstly to offer an easy and intuitive way to create and customize cards, secondly to export them in pdf format to be printed.

## Getting started

### Download release
[Latest (0.1.1-follow-up-1)](https://github.com/paullaffitte/cards-editor/releases/tag/0.1.1-follow-up-1)

### Build
Install the dependencies and build.
```yarn && yarn release```
Installers can then be found at `./dist`.

### Developpement mode
Install the dependencies.
```yarn```

Start react
```yarn start```

Start electron
```yarn electron```


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

## Authors
- [Paul Laffitte](https://github.com/paullaffitte)
