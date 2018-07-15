import PropTypes from 'prop-types'
import React from 'react'
import {
    View,
	ViewPropTypes,
    Text,
} from 'react-native'

import ss from '../../../styles'

const ActivityDescription = ({
	description,
    title = 'Activity',
	style,
}) => (
	<View style={style} >
		<Text style={styles.descriptionTitle} numberOfLines={1}>{title}</Text>
		<Text style={styles.description} >{description}</Text>
	</View>
)

ActivityDescription.propTypes = {
	description: PropTypes.string.isRequired,
	title: PropTypes.string,
	style: ViewPropTypes.style,
}

ActivityDescription.defaultProps = {
	title: 'Activity',
	style: {},
}

// StyleSheet
const {
	size,
	typo: { h1, p },
} = ss

const styles = ss.create({
	descriptionTitle: {
		...h1,
		color: ss.constants.COLOR_CORE_BRAND,
		fontSize: size(20),
	},
	description: {
		...p,
		fontSize: size(16),
		paddingTop: size(6),
	},
})

export default ActivityDescription
