import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
} from 'react-native'

import ss from '../../../styles'
import Button from './button'

const UploadButton = ({
	onPress,
}) => (
	<View style={styles.uploadButton}>
		<Button
			label="Upload"
			onPress={onPress}
		/>
	</View>
)

UploadButton.propTypes = {
	onPress: PropTypes.func.isRequired,
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	uploadButton: {
		backgroundColor: '#F9F9F9',
		padding: size(20),
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, .1)',
	},
})

export default UploadButton
