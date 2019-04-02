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
      version: '0.2.1-follow-up-2'
    },
    edited: {
      card: {},
      effect: {}
    }
  },
  availableFonts: []
};

export default initialState;
