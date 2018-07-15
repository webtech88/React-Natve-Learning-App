import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
	Text,
} from 'react-native'

import HeaderIcon from './header-icon'

import ss from '../../../styles'
import TransText from './transtext'

const NoResults = ({
	name,
	size,
	iconStyle,
	message,
}) => name || message
		? (
			<View style={styles.noResults}>
				{/* TODO Fix when all headerIcons converted to vector icons */}
				{name && <HeaderIcon name={name} size={size} iconStyle={iconStyle} />}
				{message && <View style={{ margin: ss.size(15) }}>
					<TransText style={styles.p} transkey={message} />
				</View>}
			</View>
		)
		: null

NoResults.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	iconStyle: ViewPropTypes.style,
	message: PropTypes.string.isRequired,
}

NoResults.defaultProps = {
	name: null,
	size: ss.size(42),
	iconStyle: {},
}


// StyleSheet

const {
	size,
	typo: { pLight },
} = ss

const styles = ss.create({
	noResults: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: size(20),
	},
	p: {
		...pLight,
		fontSize: size(18),
		textAlign: 'center',
	},
})

export default NoResults
