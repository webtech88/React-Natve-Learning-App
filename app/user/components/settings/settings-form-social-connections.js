import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	findNodeHandle,
} from 'react-native'

import { Field, reduxForm } from 'redux-form'

import ss from '../../../styles'
import common from '../../../common'

const { Button } = common.components.core
const { Form, TextField } = common.components.form


class SettingsFormSocialConnections extends Component {

	state = {
		activeHandle: null,
	}

	componentWillReceiveProps(nextProps) {
		const { activeField } = nextProps

		// set active field handle for scroll
		if (this.props.activeField !== activeField) {
			const handle = findNodeHandle(this[`Field_${activeField}`])
			this.setState({ activeHandle: handle })
		}
	}

	handleFocusNext = (ref) => {
		const { name } = ref.props

		if (name) {
			const input = ref.getRenderedComponent().refs[name]

			if (input) {
				// TODO BUG form state updates to hide both keybaord and datepicker and only then focuses next field
				input.focus()
			}
		}
	}

	render() {
		const { attempting } = this.props

		return (
			<View style={styles.wrapper}>
				<Form
					style={styles.container}
					behaviour="scroll"
					activeHandle={this.state.activeHandle}
				>
					<View ref={(c) => { this.Field_facebook = c }} style={styles.row}>
						<View style={styles.field}>
							<Field
								ref={(c) => { this.facebook = c }}
								withRef
								name="facebook"
								label="Facebook"
								component={TextField}
								returnKeyType="next"
								autoCorrect={false}
								autoCapitalize="none"
								editable={!attempting}
								disabled={attempting}
								onSubmitEditing={() => this.handleFocusNext(this.twitter)}
							/>
						</View>
						<Button
							style={styles.socialButton}
							color="#27599A"
							iconName="facebook"
							disabled={attempting}
							onPress={() => null}
						/>
					</View>
					<View ref={(c) => { this.Field_twitter = c }} style={styles.row}>
						<View style={styles.field}>
							<Field
								ref={(c) => { this.twitter = c }}
								withRef
								name="twitter"
								label="Twitter"
								component={TextField}
								returnKeyType="next"
								autoCorrect={false}
								autoCapitalize="none"
								editable={!attempting}
								disabled={attempting}
								onSubmitEditing={() => this.handleFocusNext(this.linkedin)}
							/>
						</View>
						<Button
							style={styles.socialButton}
							color="#01ABD6"
							iconName="twitter"
							disabled={attempting}
							onPress={() => null}
						/>
					</View>
					<View ref={(c) => { this.Field_linkedin = c }} style={styles.row}>
						<View style={styles.field}>
							<Field
								ref={(c) => { this.linkedin = c }}
								withRef
								name="linkedin"
								label="LinkedIn"
								component={TextField}
								returnKeyType="next"
								autoCorrect={false}
								autoCapitalize="none"
								editable={!attempting}
								disabled={attempting}
								onSubmitEditing={() => this.handleFocusNext(this.pinterest)}
							/>
						</View>
						<Button
							style={styles.socialButton}
							color="#0077B5"
							iconName="linkedin"
							disabled={attempting}
							onPress={() => null}
						/>
					</View>
					<View ref={(c) => { this.Field_pinterest = c }}style={styles.row}>
						<View style={styles.field}>
							<Field
								ref={(c) => { this.pinterest = c }}
								withRef
								name="pinterest"
								label="Pinterest"
								component={TextField}
								returnKeyType="done"
								autoCorrect={false}
								autoCapitalize="none"
								editable={!attempting}
								disabled={attempting}
							/>
						</View>
						<Button
							style={styles.socialButton}
							color="#BD081C"
							iconName="pinterest"
							disabled={attempting}
							onPress={() => null}
						/>
					</View>
				</Form>
			</View>
		)
	}
}

SettingsFormSocialConnections.propTypes = {
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.shape({
		facebook: PropTypes.string,
		twitter: PropTypes.string,
		linkedin: PropTypes.string,
		pinterest: PropTypes.string,
	}).isRequired,
	activeField: PropTypes.string,
}

SettingsFormSocialConnections.defaultProps = {
	activeField: undefined,
}


// StyleSheet
const {
	size,
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingHorizontal: size(20),
		paddingVertical: size(30),
	},
	row: {
		// backgroundColor: 'red', // NOTE testing flexbox
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: size(30),
	},
	field: {
		flex: 1,
		marginRight: size(20),
	},
	socialButton: {
		// marginRight: size(10),
		height: size(45),
		width: size(110),
	},
})


const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// TODO valid urls ??

	// local validation
	// FormUtil.validate(values, errors, 'facebook').required();

	// api validation
	// if (apiErrors && apiErrors.facebook) errors.facebook = apiErrors.facebook;

	return errors
}

SettingsFormSocialConnections = reduxForm({
	form: 'settingsFormSocialConnections',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SettingsFormSocialConnections)

export default SettingsFormSocialConnections
