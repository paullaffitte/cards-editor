module.exports = {
  confirmation: 'Confirmation',
  noCardSelected: 'No card selected',
  newDeck: 'New deck',
  unsavedChanges: 'unsaved changes',
  messages: {
    unsavedChangesQuit: 'quit',
    unsavedChangesNew: 'create a new deck',
    unsavedChanges: 'Your deck has unsaved changes. If you {{ifYou}} now, these changes will be lost',
    cannotDeleteModelCard: "A card used as a model can't be deleted ({{childNames}})",
    confirmDeleteItem: "Are you sure to delete this item ? (it can't be undone)",
  },
  storage: {
    open: 'Open',
    saveInFolder: 'Save in a folder',
    allFiles: 'All files',
    messages: {
      invalidDeckVersion: 'Invalid deck version "{{version}}"',
      updateRequired: "Your software is outdated ({{appVersion}}) and thus can't open this deck ({{deckVersion}}). Please update your software to be able to open this deck.",
      couldNotOpenDeck: 'Could not open this deck: {{error}}',
    }
  },
  migrations: {
    messages: {
      migratingDeck: 'migrating deck from {{from}} to {{to}}',
      oldDeckVersion: 'Deck from an old version',
      oldDeckVersionDescription: 'This deck is from an older version than your software. This version now save projects in folders instead of plain files. Thus we moved your project in a new folder. ({{projectFolder}})',
    },
  },
  electron: {
    menu: {
      file: 'File',
      view: 'View',
      settings: 'Settings',
      devTools: 'Dev tools',
      new: 'New',
      open: 'Open',
      save: 'Save',
      saveAs: 'Save as',
      exportAsPDF: 'Export as PDF',
      quit: 'Quit',
      resetZoom: 'Reset zoom',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      language: 'Language',
      reload: 'Reload',
      forceReload: 'Force reload',
      toggleDevTools: 'Toggle dev tools',
      inspectElement: 'Inspect element',
    },
    messages: {
      fileNotFound: 'File not found ({{filename}})',
      directoryNotEmpty: 'This directory is not empty. You can only save your deck in an empty folder',
    },
  },
  resourcePicker: {
    choose: 'Choose',
    cancel: 'Cancel',
    select: 'Select',
    messages: {
      notFound: 'Resource {{resourcePath}} not found',
      alreadyExists: 'Resource already exists',
    },
  },
  effectPicker: {
    newEffect: 'New effect',
  },
  itemChooser: {
    addItem: 'Add an item',
    messages: {
      alreadyAdded: 'Item already added',
      notFound: 'Item not found',
    },
  },
  itemSelect: {
    selectAnItem: 'Select an item',
    noName: 'no name',
  },
  cardTypes: {
    minion: 'Minion',
    spell: 'Spell',
  },
  cardForm: {
    tabs: {
      infoAndStats: 'Information & stats',
      transforms: 'Transforms',
    },
    type: 'Type',
    name: 'Name',
    description: 'Description',
    descriptionPlaceholder: 'Some words about the card',
    hp: 'HP',
    attack: 'Attack',
    thumbnail: 'Thumbnail',
    background: 'Background',
    effects: 'Effects',
    models: 'Models',
    messages: {
      confirmRemoveModel: 'Are you sure to remove this model from this card?',
    }
  },
  effectForm: {
    description: 'Description',
    descriptionPlaceholder: 'Death rattle: Invoke a random minion from your deck',
    messages: {
      descriptionRequired: 'Please set a description',
    },
  },
  export: {
    deckExport: 'Deck export',
    printSettings: 'Print settings',
    dpi: 'DPI',
    spacing: 'Spacing',
    export: 'Export',
    cardsSize: 'Cards size',
    cardsQuantity: 'Cards quantity',
    messages: {
      multipleCardSizes: 'This deck have multiple card sizes, please fix them before export.',
      confirmAnyway: 'I understand but I still want to export my deck.',
      cardWithoutBackground: "This card doesn't has any background. However, it will take the same size than other cards. ({{expectedWidth}}x{{expectedHeight}})",
      cardBackgroundSizeDoesntMatch: "The background's size of this card doesn't match others cards' backgrounds sizes (expected to be {{expectedWidth}}x{{expectedHeight}} but is {{width}}x{{height}})",
    },
  },
  transform: {
    color: 'Color',
    font: 'Font',
    selectFont: 'Select a font',
    scale: 'Scale',
    size: 'Size',
  },
};
