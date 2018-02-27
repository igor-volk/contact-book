import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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
            }
        })
    }

    render() {
        return (
            <div
                className={ this.state.hover ? "row background-gray-focus" : "row background-gray"}
                onMouseEnter={this.onHoverRow}
                onMouseLeave={this.onHoverRowOff}
                >
                <div>
                {this.props.contact.firstName} {this.props.contact.lastName}
                </div>
                <div
                    className={ this.state.delete ? "delete-button-focus" : "delete-button"}
                    onMouseEnter={this.onHoverDelete}
                    onMouseLeave={this.onHoverDeleteOff}
                    onClick={() => this.deleteContact()}
                    >X</div>
            </div>
        )
    }
}

const DELETE_MUTATION = gql`
  mutation DeleteMutation($contactId: ID!) {
    removeContact(id: $contactId) {
      firstName,
      lastName
    }
  }
`

export default graphql(DELETE_MUTATION, { name: "deleteMutation" })(Contact);