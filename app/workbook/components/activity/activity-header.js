import PropTypes from 'prop-types'
import React from 'react'
import {
    View,
	Text,
} from 'react-native'

import ss from '../../../styles'

const ActivityHeader = ({ activity }) => {
	const { activity_code, title, covers_criteria } = activity
	const activityNumber = activity_code && `Activity #${activity_code}`
	const outcome = covers_criteria
			&& covers_criteria.length > 0
			&& `Learning outcome ${covers_criteria.join(', ')}`
	let activityInfo

	if (activityNumber && outcome) {
		activityInfo = activityNumber.concat(' | ').concat(outcome)
	} else if (activityNumber) {
		activityInfo = activityNumber
	} else if (outcome) {
		activityInfo = outcome
	}

	return (
		<View style={styles.headerContainer} >
			<Text style={styles.title} numberOfLines={2}>{title}</Text>
			{activityInfo && (
				<Text style={styles.activityInfo} numberOfLines={2}>{activityInfo}</Text>
			)}
		</View>
	)
}
const {
	size,
	typo: { h1, p },
} = ss

ActivityHeader.propTypes = {
	activity: PropTypes.shape({
		activity_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		title: PropTypes.string,
		covers_criteria: PropTypes.arrayOf(PropTypes.string),
	}).isRequired,
}

// StyleSheet
const styles = ss.create({
	title: {
		...h1,
		fontSize: size(26),
	},
	headerContainer: {
		backgroundColor: '#F7F7F7',
		paddingVertical: size(21),
		paddingHorizontal: size(15),
	},
	activityInfo: {
		...p,
		fontSize: size(12),
		opacity: 0.7,
		marginTop: size(7),
	},
})

export default ActivityHeader
