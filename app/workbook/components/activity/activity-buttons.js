import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
} from 'react-native'

import common from '../../../common'

import ss from '../../../styles'

const { Button } = common.components.core

const ActivityButtons = ({
	saveButtonLabel,
	submitButtonLabel,
	canSubmit,
	saving,
	onSavePress,
	submitting,
	onSubmitPress,
}) => (
	<View style={styles.container}>
		<Button
			style={styles.baseButton}
			type="outline"
			label={saveButtonLabel}
			onPress={onSavePress}
			height={size(34)}
			borderRadius={2}
			disabled={!canSubmit || saving || submitting}
			isLoading={saving}
		/>
		<Button
			style={[styles.baseButton, styles.submitButton]}
			type="fill"
			label={submitButtonLabel}
			onPress={onSubmitPress}
			height={size(34)}
			borderRadius={2}
			color={ss.constants.COLOR_SUPPORTING_SECONDARY}
			disabled={!canSubmit || saving || submitting}
			isLoading={submitting}
		/>
	</View>
)

ActivityButtons.propTypes = {
	saveButtonLabel: PropTypes.string,
	submitButtonLabel: PropTypes.string,
	canSubmit: PropTypes.bool,
	saving: PropTypes.bool,
	onSavePress: PropTypes.func,
	submitting: PropTypes.bool,
	onSubmitPress: PropTypes.func,
}

ActivityButtons.defaultProps = {
	saveButtonLabel: 'Save',
	submitButtonLabel: 'Submit',
	canSubmit: false,
	saving: false,
	onSavePress: () => {},
	submitting: false,
	onSubmitPress: () => {},
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
		flexDirection: 'row',
		alignSelf: 'flex-end',
		paddingVertical: size(20),
	},
	baseButton: {
		width: size(90),
	},
	submitButton: {
		marginLeft: size(10),
	},
})


export default ActivityButtons
