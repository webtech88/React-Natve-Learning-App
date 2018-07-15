import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import common from '../../common'
import ProfileBioListView from '../components/profile-bio-list-view'

import ss from '../../styles'

const { Button } = common.components.core
const { NavBar, NavBarIconButton } = common.components.navigation

class ProfileExperienceScreen extends Component {

	render() {
		const {
			profileType,
			experience,
			navigateToProfileAddBio,
			navigateToProfileEditBio,
		} = this.props
		let bioProps

		if (R.equals('user', profileType)) {
			bioProps = {
				onEdit: navigateToProfileEditBio,
			}
		}

		return (
			<View style={styles.wrapper}>
				<NavBar
					title={this.props.title}
					renderLeftButton={() => (
						<NavBarIconButton name="cancel"
							onPress={() => NavigationActions.pop()}
						/>
					)}
					navigationBarStyle={{ borderBottomWidth: 1 }}
				/>
				{R.equals('user', profileType) &&
					<View style={styles.add}>
						<Button
							label="Add"
							onPress={navigateToProfileAddBio}
						/>
					</View>
				}
				{experience &&
					<ProfileBioListView type="experience" bio={experience} {...bioProps} />
				}
			</View>
		)
	}

}


// StyleSheet
const {
	size,
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	add: {
		backgroundColor: '#F9F9F9',
		padding: size(20),
		borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, .1)',
	},
})

// Redux mappings
const mapStateToProps = state => ({
	experience: state.profile.experience,
	connectionProfile: state.profile.connectionProfile.data,
	connectionExperience: state.profile.connectionProfile.experience,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	let title = stateProps.connectionProfile && `${stateProps.connectionProfile.first_name}' Experience`
	let experience = stateProps.connectionExperience

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		title = 'My Experience'
		experience = stateProps.experience
	}

	return {
		...ownProps,
		title,
		experience,
		navigateToProfileAddBio: () => {
			NavigationActions.ProfileBioForm({
				title: 'Add Experience',
				initialValues: {
					member_bio_id: null,
					type: 'experience',
					cloudinary_file_id: null,
					title: '',
					subtitle: '',
					description: '',
					from_date: '',
					to_date: '',
					location: '',
				},
			})
		},
		navigateToProfileEditBio: (initialValues) => {
			NavigationActions.ProfileBioForm({
				title: 'Edit Experience',
				initialValues,
			})
		},
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfileExperienceScreen)
