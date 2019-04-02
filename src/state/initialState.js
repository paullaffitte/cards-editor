const initialState = {
  deck: {
    current: {
      filename: null,
      cardsConfig: {},
      cards: [],
      effects: [],
      resources: {},
      exportConfig: {
        cardsQuantity: {}
      },
      updated: false,
      version: '1.0.0'
    },
    edited: {
      card: {},
      effect: {}
    }
  },
  availableFonts: []
};

export default initialState;
