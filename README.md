# Cards Editor
Cards Editor is an open source software based on Electron and React with Redux. Its goal is firstly to offer an easy and intuitive way to create and customize cards, secondly to export them in pdf format to be printed. Installers are currently availables for Linux and Windows.

## Getting started

### Download release
You can find installers for Windows and Linux in project's releases.

[`latest (1.0.0)`](https://github.com/paullaffitte/cards-editor/releases/latest)

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
The software is divided in two main parts, the preview on the left and the editor on the right. You can also find a card list in the right sider.

### Card List
The card list is the first element with which you will interact at first glance. It allows you to select the type of card that you want to list (can be spell or minion), to select a card and to create or delete one.

The color code used is the same in all lists that you can find ine the software.
- Green: selected
- Orange: unsaved changes
- Blue: hover

### Preview
The preview is pretty simple since it's just a preview of the card that you are editing.

The preview's card is rendered at a constant pixel width, thus the card will be scaled if it doesn't exactly fit in the predefined dimensions. However, this doesn't affect the export but only the preview, thus you should not have to worry about the size of the card in your preview since the print size will be defined at export.

### Editor
This is the main part of the application, you will spend the most of your time using this part since it allows you to customize your cards. It is divided in three tabs that are described below.

#### Information & stats
This tab contains basic informations about the card such as a card type or name. There is two types of cards, spell and minion. Here are a table of properties availables for both of them.

| Property      | Type          | Description                                                                          | Target  |
| ------------- | ------------- | ------------------------------------------------------------------------------------ |:-------:|
| Type          | Option        | Type of the card `spell` \| `minion`                                                 | both    |
| Name          | String        | Name of the card                                                                     | both    |
| Description   | String        | Description of the card                                                              | both    |
| Hp            | Number        | Health points                                                                        | minion  |
| Attack        | Number        | Attack points                                                                        | minion  |
| Thumbnail     | Image         | The image used to represent the minion/spell on the card                             | both    |
| Background    | Image         | The image to use as a frame for the card                                             | both    |
| Effects       | String list   | Effect's list of the card. It is merged with the description and appears just before | both    |

##### Resource picker
The resource picker allows you to add resources (like images) in your deck, and select them for a specific usage. Resources only needs to be added once, and then can be used by any of your cards.

You can find a resource picker under the `background` or the `thumbnail` fields. By clicking on the "choose" button, you open a picker for the corresponding property. It opens in a modal composed of two parts : the resource list and the preview. The first one lists all the resources availables in your deck, the second one show a preview for the selected resource. When you selected the resource that you want to use, click on select to validate your selection, or cancel to discard it.

##### Effect list
Effect are parts of description that can be used across cards since the list is global to the deck. In addition to the classical behavior of the list, there is also an edit button beside the delete button.

Effects are added at begining of the description of a card.

#### Transforms
documentation is not available yet.

#### Global
documentation is not available yet.

### Export
documentation is not available yet.

## Screenshots
not available yet.
