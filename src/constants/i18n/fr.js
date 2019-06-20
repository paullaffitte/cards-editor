module.exports = {
  confirmation: 'Confirmation',
  noCardSelected: 'Pas de carte sélectionnée',
  newDeck: 'Nouveau deck',
  unsavedChanges: 'modifications non enregistrées',
  messages: {
    unsavedChangesQuit: 'quittez',
    unsavedChangesNew: 'créez un nouveau deck',
    unsavedChanges: 'Votre deck a des modifications non enregistrées. Si vous {{ifYou}} maintenant, ces modifications seront perdues.',
    cannotDeleteModelCard: "Une carte utilisée en tant que model ne peut être supprimée ({{childNames}})",
    confirmDeleteItem: "Êtes-vous sûr de supprimer cet element ? (ne peut être annulé)",
  },
  storage: {
    open: 'Ouvrir',
    saveInFolder: 'Sauvegarder dans un dossier',
    allFiles: 'Tout types',
    messages: {
      invalidDeckVersion: 'Version de deck invalide "{{version}}"',
      updateRequired: "Votre logiciel n'est plus à jour ({{appVersion}}) et ne peut donc pas ouvrir ce deck ({{deckVersion}}). Merci de mettre à jour votre logiciel afin d'ouvrir ce deck.",
      couldNotOpenDeck: 'Ouverture du deck impossible: {{error}}',
    }
  },
  migrations: {
    messages: {
      migratingDeck: 'En train de migrer le deck de {{from}} à {{to}}',
      oldDeckVersion: "Deck d'une version antérieure",
      oldDeckVersionDescription: "Ce deck provient d'une version antérieure à votre logiciel. Cette version sauvegarde maintenant les projets dans un dossier au lieu d'un fichier. Nous avons donc déplacé votre projet dans un nouveau dossier ({{projectFolder}})",
    },
  },
  electron: {
    menu: {
      file: 'Fichier',
      view: 'Vue',
      settings: 'Paramètres',
      devTools: 'Outils de développement',
      new: 'Nouveau',
      open: 'Ouvrir',
      save: 'Sauvegarder',
      saveAs: 'Sauvegarder sous',
      exportAsPDF: 'Exporter en tant que PDF',
      quit: 'Quitter',
      resetZoom: 'Réinitializer le zoom',
      zoomIn: 'Zoomer',
      zoomOut: 'Dézoomer',
      language: 'Langage',
      reload: 'Rafraichir la page',
      forceReload: 'Forcer le rafraichissement',
      toggleDevTools: 'Basculer le mode dev',
      inspectElement: "Inspecter l'élément",
    },
    messages: {
      fileNotFound: 'Fichier introuvable ({{filename}})',
      directoryNotEmpty: "Ce dossier n'est pas vide. Vous pouvez seulement sauvegarder votre deck dans des dossiers vides",
    },
  },
  resourcePicker: {
    choose: 'Choisir',
    cancel: 'Annuler',
    select: 'Sélectionner',
    messages: {
      notFound: 'Ressource {{resourcePath}} introuvable',
      alreadyExists: 'Ressource déjà existante',
    },
  },
  effectPicker: {
    newEffect: 'Nouvel effet',
  },
  itemChooser: {
    addItem: 'Ajouter un élément',
    messages: {
      alreadyAdded: 'Elément déjà ajouté',
      notFound: 'Elément introuvable',
    },
  },
  itemSelect: {
    selectAnItem: 'Sélectionner un élément',
    noName: 'sans nom',
  },
  cardTypes: {
    minion: 'Serviteur',
    spell: 'Sort',
  },
  cardForm: {
    tabs: {
      infoAndStats: 'Informations & stats',
      transforms: 'Transformations',
    },
    type: 'Type',
    name: 'Nom',
    description: 'Description',
    descriptionPlaceholder: 'Quelques mots à propos de la carte',
    hp: 'HP',
    attack: 'Attaque',
    thumbnail: 'Vignette',
    background: 'Fond',
    effects: 'Effets',
    models: 'Models',
    messages: {
      confirmRemoveModel: "Êtes-vous sûr d'enlever ce model de cette carte ?",
    }
  },
  effectForm: {
    description: 'Description',
    descriptionPlaceholder: "Râle d'agonie: Invoque un serviteur aléatoire de votre deck",
    messages: {
      descriptionRequired: 'Veuillez entrer une description',
    },
  },
  export: {
    deckExport: 'Export du deck',
    printSettings: "Paramètres d'impression",
    dpi: 'DPI',
    spacing: 'Espacement',
    export: 'Exporter',
    cardsSize: 'Taille des cartes',
    cardsPerPage: 'Cartes par pages',
    cards: 'Cartes',
    pages: 'Pages',
    messages: {
      multipleCardSizes: "Ce deck a des cartes de plusieurs taille différentes, veuillez y remédier avant d'exporter",
      confirmAnyway: 'Je comprends mais je veux toujours exporter mon deck.',
      cardWithoutBackground: "Cette carte n'as pas de fond. Cepandant, elle prendra la même taille que les autres cartes. ({{expectedWidth}}x{{expectedHeight}})",
      cardBackgroundSizeDoesntMatch: "La taille du fond de cette carte ne coresspond pas à celle du fond des autres cartes. (devrait être {{expectedWidth}}x{{expectedHeight}} mais est {{width}}x{{height}})",
    },
  },
  transform: {
    color: 'Couleur',
    font: 'Police',
    selectFont: 'Slectionnez une police',
    scale: 'Agrandissement',
    size: 'Taille',
  },
};
