import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './ContactList'

class CreateContact extends Component {
    state = {
        firstName: '',
        lastName: ''
    }

    render() {
        return (
            <div>
            <div className="flex flex-column mt3">
            <input
                className="mb2"
                value={this.state.description}
                onChange={e => this.setState({ firstName: e.target.value })}
                type="text"
                placeholder="Last name"
            />
            <input
                className="mb2"
                value={this.state.url}
                onChange={e => this.setState({ lastName: e.target.value })}
                type="text"
                placeholder="First name"
            />
            </div>
            <button onClick={() => this.createContact()}>Submit</button>
        </div>
    )
    }

    createContact = async () => {
        const { firstName, lastName } = this.state
        await this.props.postMutation({
            variables: {
                firstName,
                lastName
            },
            update: (store, { data: { post } }) => {
                const data = store.readQuery({ query: FEED_QUERY })
                data.feed.splice(0, 0, post)
                store.writeQuery({
                    query: FEED_QUERY,
                    data
                })
            }
        })
        this.props.history.push(`/`)
    }
}

const POST_MUTATION = gql`
  # 2
  mutation PostMutation($firstName: String!, $lastName: String!) {
    post(firstName: $firstName, lastName: $lastName) {
      id,
      firstName,
      lastName
    }
  }
`


export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateContact)