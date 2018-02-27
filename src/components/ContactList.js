import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Contact from './Contact'

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

const FEED_QUERY = gql`
  # 2
  query FeedQuery {
    feed {
      id
      firstName
      lastName
    }
  }
`

// 3
export default graphql(FEED_QUERY, { name: 'feedQuery' }) (ContactList)