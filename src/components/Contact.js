import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import flow from 'lodash.flow'

import { FEED_QUERY } from './ContactList'

class Contact extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hover: false,
            delete: false
        }
        this.onHoverRow = this.onHoverRow.bind(this);
        this.onHoverRowOff = this.onHoverRowOff.bind(this);
        this.onHoverDelete = this.onHoverDelete.bind(this);
        this.onHoverDeleteOff = this.onHoverDeleteOff.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.editContact = this.editContact.bind(this);
    }

    onHoverRow() {
        this.setState({ hover: true });
    }

    onHoverRowOff() {
        this.setState({ hover: false });
    }

    onHoverDelete() {
        this.setState({ delete: true });
    }

    onHoverDeleteOff() {
        this.setState({ delete: false });
    }

    deleteContact = async () => {
        const contactId = this.props.contact.id
        await this.props.deleteMutation({
            variables: {
                contactId
            },
            update: (store, { data: { removeContact } }) => {
                const data = store.readQuery({ query: FEED_QUERY })
                const newData = Object.assign({}, data);
                newData.feed = data.feed.filter(e => e.id !== removeContact.id)
                store.writeQuery({
                    query: FEED_QUERY,
                    newData
                })
            }
        })
    }

    editContact() {
        this.props.history.push(`/edit/${this.props.contact.id}`)
    }

    render() {
        return (
            <div
                className={this.state.hover ? "row background-gray-focus" : "row background-gray"}
                onMouseEnter={this.onHoverRow}
                onMouseLeave={this.onHoverRowOff}
                onClick={this.editContact}
                >
                <div className="ml1 no-underline black">
                    {this.props.contact.firstName} {this.props.contact.lastName}
                </div>
                <div
                    className={ this.state.delete ? "delete-button-focus" : "delete-button"}
                    onMouseEnter={this.onHoverDelete}
                    onMouseLeave={this.onHoverDeleteOff}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.deleteContact();
                    }}
                    >X</div>
            </div>
        )
    }
}

const DELETE_MUTATION = gql`
  mutation DeleteMutation($contactId: ID!) {
    removeContact(id: $contactId) {
      id
      firstName
      lastName
    }
  }
`

export default flow(
    withRouter,
    graphql(DELETE_MUTATION, { name: "deleteMutation" }))
(Contact);