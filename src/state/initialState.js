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
        cardSize: { width: 400, height: 600 }
      },
      updated: false,
      version: '1.0.2'
    },
    edited: {
      card: {},
      effect: {}
    }
  },
  availableFonts: []
};

export default initialState;
