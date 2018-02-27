import React, { Component } from 'react'
import CreateLink from './CreateLink'
import ContactList from './ContactList'
import Header from './Header'
import { Switch, Route } from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div className="center w85">
                <Header />
                <div className="ph3 pv1">
                    <Switch>
                        <Route exact path="/" component={ContactList} />
                        <Route exact path="/create" component={CreateLink} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App
