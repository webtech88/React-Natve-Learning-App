import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import ss from '../../../styles'
import common from '../../../common'

import ProfileBioListView from '../profile-bio-list-view'
import ProfileCardHeader from './profile-card-header'
import ProfileCardFooter from './profile-card-footer'

const { Loading, NoResults, Button } = common.components.core


class ProfileCardExperience extends Component {

	shouldComponentUpdate(nextProps) {
		const { experience, gettingBio, canAdd } = this.props

		if (!R.equals(experience, nextProps.experience)) {
			return true
		}

		if (gettingBio !== nextProps.gettingBio) {
			return true
		}

		if (canAdd !== nextProps.canAdd) {
			return true
		}

		return false
	}

	render() {
		const {
			experience,
			gettingBio,
			onShowAll,
			canAdd,
			onAdd,
		} = this.props
		let contents = null

		if (experience && experience.length) {
			// has experience
			contents = (
				<View style={{ flex: 1 }}>
					<ProfileBioListView type="experience" bio={experience} />
					<ProfileCardFooter onPress={onShowAll} />
				</View>
			)
		} else if (gettingBio) {
			// show loading while getting bio
			contents = <Loading style={styles.loading} />
		} else {
			// no experience
			contents = (
				<View style={styles.noResults}>
					<NoResults
						name="experience"
						size={ss.size(60)}
						message="No records yet"
					/>
					{canAdd && onAdd && <Button
						label="Add"
						disabled={false}
						isLoading={false}
						onPress={onAdd}
					/>}
				</View>
			)
		}

		return (
			<View style={{ flex: 1 }}>
				<ProfileCardHeader title="Experience" onPress={onAdd} />
				<View style={{ flex: 1 }}>
					{contents}
				</View>
			</View>
		)
	}
}

ProfileCardExperience.propTypes = {
	experience: PropTypes.arrayOf(PropTypes.object),
	gettingBio: PropTypes.bool.isRequired,
	canAdd: PropTypes.bool,
	onAdd: PropTypes.func,
	onShowAll: PropTypes.func,
}

ProfileCardExperience.defaultProps = {
	experience: null,
	canAdd: false,
	onAdd: null,
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

export default ProfileCardExperience
