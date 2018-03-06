import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Contact from './Contact'
import { CONTACTS_QUERY } from '../operations'

class ContactList extends Component {
    render() {
        if (this.props.feedQuery && this.props.feedQuery.loading) {
            return <div>Loading</div>
        }

        if (this.props.feedQuery && this.props.feedQuery.error) {
            return <div>Error</div>
        }

        const contactsToRender = this.props.feedQuery.feed

        return (
            <div>{contactsToRender.map(contact => <Contact key={contact.id} contact={contact} />)}</div>
        )
    }
}

export default graphql(CONTACTS_QUERY, { name: 'feedQuery'}) (ContactList)