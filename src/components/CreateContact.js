import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import flow from 'lodash.flow'

import { 
    CONTACTS_QUERY, 
    POST_MUTATION, 
    ADD_PHONE_NUMBER_MUTATION 
} from '../operations'

import PhoneNumber from './PhoneNumber'

class CreateContact extends Component {
    constructor (props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            phoneNumbers: []
        }

        this.addPhoneNumber = this.addPhoneNumber.bind(this);
        this.createContact = this.createContact.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
        this.onLabelChange = this.onLabelChange.bind(this);
        this.onPhoneNumberDelete = this.onPhoneNumberDelete.bind(this);
        this.renderPhoneNumber = this.renderPhoneNumber.bind(this);
    }

    addPhoneNumber() {
        this.setState({
            phoneNumbers: [...this.state.phoneNumbers, {
                phoneNumber: '',
                label: ''
            }]
        });
    }

    onNumberChange (value, index) {
        const phoneNumbers = this.state.phoneNumbers;
        phoneNumbers[index].phoneNumber = value;
        this.setState({
            phoneNumbers: phoneNumbers
        });
    }

    onLabelChange (value, index) {
        const phoneNumbers = this.state.phoneNumbers;
        phoneNumbers[index].label = value;
        this.setState({
            phoneNumbers: phoneNumbers
        });
    }

    onPhoneNumberDelete (index) {
        const phoneNumbers = this.state.phoneNumbers;
        phoneNumbers.splice(index, 1);
        this.setState({
            phoneNumbers: phoneNumbers
        });
    }

    renderPhoneNumber (phoneNumber, i) {
        return (
            <PhoneNumber
                key={i}
                index= {i}
                data={phoneNumber}
                onNumberChange={this.onNumberChange}
                onLabelChange={this.onLabelChange}
                onDelete={this.onPhoneNumberDelete}
            />
        )
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
                <button onClick={() => this.addPhoneNumber()}>Add phone number</button>
                <div>{this.state.phoneNumbers.map(this.renderPhoneNumber)}</div>
                <button onClick={() => this.createContact()}>Save</button>
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
                const data = store.readQuery({ query: CONTACTS_QUERY })
                data.feed.push(post)
                store.writeQuery({
                    query: CONTACTS_QUERY,
                    data
                })
            }
        }).then(async ({ data: { post: { id } } }) => {
            await Promise.all(this.state.phoneNumbers.map(async item => {
                const { phoneNumber, label } = item;
                const contactId = id
                await this.props.addPhoneNumberMutation({
                    variables: {
                        phoneNumber,
                        label,
                        contactId
                    }
                })
            }));
        });
        this.props.history.push(`/`)
    }
}

const createContactMutation = graphql(POST_MUTATION, { name: 'postMutation' });
const addPhoneNumberMutation = graphql(ADD_PHONE_NUMBER_MUTATION, { name: 'addPhoneNumberMutation' });

export default flow(
    createContactMutation,
    addPhoneNumberMutation
)(CreateContact)