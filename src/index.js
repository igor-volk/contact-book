import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css';
import App from './components/App';
import configureStore from './configureStore';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const client = new ApolloClient({
    ssrMode: true,
    link: httpLink,
    cache: new InMemoryCache()
});

// const store = {}; //configureStore(client);

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
)
registerServiceWorker()
