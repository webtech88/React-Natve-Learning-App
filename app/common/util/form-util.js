function validate(_values, _errors, _field) {
	if (!(this instanceof validate)) {
		return new validate(_values, _errors, _field)
	}

	// required
	this.required = (message) => {
		if (!this.values[this.field] || (typeof this.values[this.field] === String && !this.values[this.field].replace(/^\s+/g, '').length)) {
			this.errors[this.field] = message || 'This field is required.'
		}

		return this
	}

	// email
	this.email = () => {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

		if (!regex.test(this.values[this.field])) {
			this.errors[this.field] = 'Please enter a valid email address.'
		}

		return this
	}

	this.matches = (comparisonField, message) => {
		if (this.values[this.field] !== this.values[comparisonField]) {
			this.errors[this.field] = message || 'Fields do not match.'
		}

		return this
	}

	// TODO needed ???
	// this.passwordLength = () => {
	// 	if (this.values[this.field]) {
	// 		if (this.values[this.field].length < 8 || this.values[this.field].length > 32) {
	// 			this.errors[this.field] = 'Password length should be between 8 and 32 characters.';
	// 		}
	// 	}
	//
	// 	return this;
	// }

	this.values = _values
	this.errors = _errors
	this.field = _field

	return this
}

export default {
	validate,
}
