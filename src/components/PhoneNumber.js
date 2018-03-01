import React, { Component } from 'react'

class PhoneNumber extends Component {
	constructor (props) {
		super(props);

		this.state = {
			delete: false
		}
		
		this.onHoverDelete = this.onHoverDelete.bind(this);
		this.onHoverDeleteOff = this.onHoverDeleteOff.bind(this);
	}

	componentWillReceiveProps (nextProps) {

	}

	onHoverDelete() {
		this.setState({ delete: true });
	}

	onHoverDeleteOff() {
		this.setState({ delete: false });
	}

	render () {
		return (
			<div className="row">
				<input
					className="mb2"
					value={this.props.data.phoneNumber}
					onChange={e => this.props.onNumberChange(e.target.value, this.props.index)}
					type="text"
					placeholder="Number"
				/>
				<input
					className="mb2"
					value={this.props.data.label}
					onChange={e => this.props.onLabelChange(e.target.value, this.props.index)}
					type="text"
					placeholder="Label"
				/>
				<div
					className={ this.state.delete ? "delete-button-focus" : "delete-button"}
					onMouseEnter={this.onHoverDelete}
					onMouseLeave={this.onHoverDeleteOff}
					onClick={(e) => {
						e.stopPropagation();
						this.props.onDelete(this.props.index);
					}}
					>X</div>
			</div>
		)
	}
}

export default PhoneNumber