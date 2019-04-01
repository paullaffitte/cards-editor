import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.scss';
import reducers from './state/reducers/index';
import { getCurrentDeck } from './state/selectors/deck';
import DeckEditor from './components/DeckEditor';
import DeckViewer from './components/DeckViewer';
import DeckStorage from './services/DeckStorage';


const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

DeckStorage.initFonts(store);

const PageTitle = connect(state => ({
  filename: getCurrentDeck(state).filename
}))(class extends Component {

  componentDidMount() {
    document.originalTitle = document.title;
  }

  componentWillUpdate(nextProps) {
    document.title = nextProps.filename
      ? document.originalTitle + ' - ' + nextProps.filename
      : document.originalTitle;
  }

  render = () => null;
});

class App extends Component {

  state = {
    exportMode: false
  }


  render() {
    return (
      <Provider store={store}>
        <PageTitle />
        { !this.state.exportMode
          ? (
            <Layout className="app">
              <DeckEditor toggleExportMode={ exportMode => this.setState({ exportMode }) } />
            </Layout>
          )
          : (<DeckViewer style={{ backgroundColor: 'white' }} />)
        }
      </Provider>
    );
  }
}

export default App;
