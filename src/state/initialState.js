const initialState = {
  deck: {
    current: {
      filename: null,
      cards: [],
      effects: [],
      resources: {},
    },
    edited: {
      card: {},
      effect: {}
    }
  }
};

export default initialState;
