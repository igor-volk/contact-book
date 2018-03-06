import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import flow from 'lodash.flow'

import { 
    CONTACTS_QUERY,
    DELETE_CONTACT_MUTATION,
    DELETE_PHONE_NUMBERS_MUTATION
} from '../operations'

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
        await this.props.deleteContactMutation({
            variables: {
                contactId
            },
            update: (store, { data: { removeContact } }) => {
                const data = store.readQuery({ query: CONTACTS_QUERY })
                const newContacts = data.feed.filter(e => e.id !== removeContact.id)
                data.feed = newContacts
                store.writeQuery({
                    query: CONTACTS_QUERY,
                    data
                })
            }
        });
        await this.props.deletePhoneNumbersMutation({
            variables: {
                contactId
            }
        });
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

const deleteContactMutation = graphql(DELETE_CONTACT_MUTATION, { name: "deleteContactMutation" });
const deletePhoneNumbersMutation = graphql(DELETE_PHONE_NUMBERS_MUTATION, { name: "deletePhoneNumbersMutation" });

export default flow(
    withRouter,
    deleteContactMutation,
    deletePhoneNumbersMutation
)(Contact);