export default {
  confirmation: 'Confirmation',
  noCardSelected: 'No card selected',
  newDeck: 'New deck',
  messages: {
    unsavedChanges: 'Your deck has unsaved changes. If you quit now, these changes will be lost',
    unsavedChangesNewDeck: 'Your deck has unsaved changes. If you create a new deck now, these changes will be lost',
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
      unknownError: 'Unknown error',
      couldNotOpenDeck: 'Could not open this deck: {{error}}',
    }
  },
  electron: {
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
      cardWithoutBackground: "This card doesn't has any background. However, this card will take the same size than other cards. ({{expectedWidth}}x{{expectedHeight}})",
      cardBackgroundSizeDoesntMatch: "The background's size of this card doesn't match others cards' backgrounds sizes (expected to be {{expectedWidth}}x{{expectedHeight}} but is {{width}}x{{height}})",
    },
  },
};