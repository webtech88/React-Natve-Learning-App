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


class ProfileCardEducation extends Component {

	shouldComponentUpdate(nextProps) {
		const { education, gettingBio, canAdd } = this.props

		if (!R.equals(education, nextProps.education)) {
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
			education,
			gettingBio,
			canAdd,
			onAdd,
			onShowAll,
		} = this.props
		let contents = null

		if (education && education.length) {
			// has education
			contents = (
				<View style={{ flex: 1 }}>
					<ProfileBioListView type="education" bio={education} />
					<ProfileCardFooter onPress={onShowAll} />
				</View>
			)
		} else if (gettingBio) {
			// show loading while getting bio
			contents = <Loading style={styles.loading} />
		} else {
			// no education
			contents = (
				<View style={styles.noResults}>
					<NoResults
						// icon={ss.images.iconHeaderEducation}
						// iconWidth={72}
						// iconHeight={44}
						name="education"
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
				<ProfileCardHeader title="Education" onPress={onAdd} />
				<View style={{ flex: 1 }}>
					{contents}
				</View>
			</View>
		)
	}

}

ProfileCardEducation.propTypes = {
	education: PropTypes.arrayOf(PropTypes.object),
	gettingBio: PropTypes.bool.isRequired,
	canAdd: PropTypes.bool,
	onAdd: PropTypes.func,
	onShowAll: PropTypes.func,
}

ProfileCardEducation.defaultProps = {
	education: null,
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

export default ProfileCardEducation
