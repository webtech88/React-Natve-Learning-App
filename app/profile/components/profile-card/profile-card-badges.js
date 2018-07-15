import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import ss from '../../../styles'
import common from '../../../common'

import ProfileBadgesListView from '../profile-badges-list-view'
import ProfileCardHeader from './profile-card-header'
import ProfileCardFooter from './profile-card-footer'

const { Loading, NoResults } = common.components.core


class ProfileCardBadges extends Component {

	shouldComponentUpdate(nextProps) {
		const { badges, gettingBadges } = this.props

		if (!R.equals(badges, nextProps.badges)) {
			return true
		}

		if (gettingBadges !== nextProps.gettingBadges) {
			return true
		}

		return false
	}

	render() {
		const {
			badges,
			gettingBadges,
			onShowAll,
		} = this.props
		let contents = null

		if (badges && badges.length) {
			// has badges
			contents = (
				<View style={{ flex: 1 }}>
					<ProfileBadgesListView badges={badges} />
					<ProfileCardFooter onPress={onShowAll} />
				</View>
			)
		} else if (gettingBadges) {
			// show loading while getting badges
			contents = <Loading style={styles.loading} />
		} else {
			// no badges
			contents = (
				<View style={styles.noResults}>
					<NoResults
						name="achievements"
						size={ss.size(42)}
						message="No badges yet. Keep studying and you will get one soon"
					/>
				</View>
			)
		}

		return (
			<View style={{ flex: 1 }}>
				<ProfileCardHeader title="Badges" />
				<View style={{ flex: 1 }}>
					{contents}
				</View>
			</View>
		)
	}

}

ProfileCardBadges.propTypes = {
	badges: PropTypes.arrayOf(PropTypes.object),
	gettingBadges: PropTypes.bool.isRequired,
	onShowAll: PropTypes.func,
}

ProfileCardBadges.defaultProps = {
	badges: [],
	onShowAll: null,
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	noResults: {
		flex: 1,
		padding: size(20),
	},
})

export default ProfileCardBadges
