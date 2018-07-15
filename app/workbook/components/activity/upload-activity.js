import React, { Component } from 'react'
import {
	View,
	ScrollView,
} from 'react-native'

import common from '../../../common'

import ActivityDescription from './activity-description'
import ActivityHeader from './activity-header'
import UploadMedia from './activity-media-upload'
import ActivityButtons from './activity-buttons'
import ActivityImage from './activity-image'

import ss from '../../../styles'

const { deleteCloudinaryFile } = common.util.helpers

const getRandomId = () => Math.random().toString(36).substr(2, 7)

class UploadActivity extends Component {

	constructor(props) {
		super(props)
		const { activity } = props


		const content = activity.content
		const uploads = this.props.uploads ? this.props.uploads.asMutable() : []

		this.state = {
			content,
			uploads: uploads.concat([getRandomId()]),
		}
	}

	changeForm = (uploads) => {
		const { onChange } = this.props
		const newArray = uploads.slice(0)
		newArray.pop()

		onChange('input0', newArray)
	}

	handleMediaUploadComplete = (id) => {
		const { uploads } = this.state
		uploads[uploads.length - 1] = id
		uploads.push(getRandomId())
		this.setState({ uploads }, () => this.changeForm(uploads))
	}

	handleDeletePress = (id) => {
		const { uploads } = this.state
		const filtered = uploads.filter(el => el !== id)
		deleteCloudinaryFile(id)
			.then(() => this.setState({ uploads: filtered }, () => this.changeForm(filtered)))
			.catch(e => console.log(e))
	}

	// #TODO Elements not being removed
	render() {
		const { uploads } = this.state
		const {
			userId,
			activity,
			canModify,
			canSubmit,
			saving,
			onSave,
			submitting,
			onSubmit,
		} = this.props

		return (
			<ScrollView style={styles.container} >
				<ActivityHeader activity={activity} />
				<ActivityImage />
				<View style={styles.contentContainer}>
					<ActivityDescription description={activity.content.activityText} style={styles.description} />
					{[uploads[0]].map(element => // use all elements to enable multiple uploads
						(<View key={element} style={styles.uploadMediaContainer}>
							<UploadMedia
								onMediaUploadComplete={this.handleMediaUploadComplete}
								userId={userId}
								canModify={canModify || saving || submitting}
								onDeletePress={this.handleDeletePress}
								media={element.length > 9 ? element : null}
							/>
						</View>),
					)}
					<ActivityButtons
						canSubmit={canSubmit}
						saving={saving}
						onSavePress={onSave}
						submitting={submitting}
						onSubmitPress={onSubmit}
					/>
				</View>
			</ScrollView>
		)
	}
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: size(15),
	},
	description: {
		paddingTop: size(22),
	},
	uploadMediaContainer: {
		paddingTop: size(10),
	},
})

export default UploadActivity
