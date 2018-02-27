import React, { Component } from 'react'
import CreateContact from './CreateContact'
import ContactList from './ContactList'
import EditContact from './EditContact'
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
                        <Route exact path="/create" component={CreateContact} />
                        <Route exact path="/edit/:id" component={EditContact} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App
