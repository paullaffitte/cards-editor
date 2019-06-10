const initialState = {
  deck: {
    current: {
      filename: null,
      openAt: 0,
      cards: [],
      effects: [],
      resources: {},
      exportConfig: {
        cardsQuantity: {},
      },
      updated: false,
      version: '1.2.0'
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
