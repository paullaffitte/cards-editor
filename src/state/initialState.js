const initialState = {
  deck: {
    current: {
      updated: false,
      filename: null,
      cardsConfig: {},
      cards: [],
      effects: [],
      resources: {},
      exportConfig: {
        cardsQuantity: {}
      }
    },
    edited: {
      card: {},
      effect: {}
    }
  },
  availableFonts: []
};

export default initialState;
