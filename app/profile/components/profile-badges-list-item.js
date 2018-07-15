import React, { Component } from 'react'
import { 
	View,
	Text
} from 'react-native'

import moment from 'moment-timezone'

import ss from '../../styles'
import common from '../../common'

const { AchievementsBadge } = common.components.profile
const { TransText } = common.components.core


class ProfileBadgesListItem extends Component {

	render() {
		const { badge } = this.props

		return (
			<View style={styles.container}>
				<AchievementsBadge
					badge={badge.badge}
					height={size(60)}
					width={size(50)}
					style={{ marginRight: size(20) }}
				/>
				<View style={styles.textContainer}>
					<TransText numberOfLines={1} style={styles.title} transkey={badge.title} />
					<TransText numberOfLines={1} style={styles.description} transkey={badge.description} />
					<Text numberOfLines={1} style={styles.date}>
						{moment(badge.date).format('D MMMM YYYY')}
					</Text>
				</View>
			</View>
		)
	}
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	container: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		padding: size(20),
	},
	badge: {
		marginRight: size(20),
	},
	textContainer: {
		flex: 1,
	},
	title: {
		...p,
	},
	description: {
		...p,
		fontSize: size(14),
	},
	date: {
		...p,
		fontSize: size(12),
		opacity: 0.7,
	},
})

export default ProfileBadgesListItem
