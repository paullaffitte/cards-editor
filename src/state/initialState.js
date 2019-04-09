const initialState = {
  deck: {
    current: {
      filename: null,
      openAt: 0,
      cardsConfig: {},
      cards: [],
      effects: [],
      resources: {},
      exportConfig: {
        cardsQuantity: {},
      },
      updated: false,
      version: '1.0.2'
    },
    edited: {
      card: {},
      effect: {}
    },
    cardSize: { width: 400, height: 600 }
  },
  availableFonts: [],
  latestVersion: null
};

export default initialState;
