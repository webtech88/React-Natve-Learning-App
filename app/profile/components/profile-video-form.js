import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	Animated,
	View,
	TouchableOpacity,
	findNodeHandle,
} from 'react-native'

import { Field, reduxForm } from 'redux-form'

import ss from '../../styles'
import common from '../../common'

const { Button, CloudinaryImage } = common.components.core
const { Form, TextField, RadioField, TagField } = common.components.form
const { FormUtil, ImagePicker } = common.util
const { VideoPlayer } = common.components.video

const TRANSLATE_X = ss.constants.WIDTH_DEVICE
const VIDEO_WIDTH = ss.constants.WIDTH_DEVICE
const VIDEO_HEIGHT = ss.size(200)

class ProfileVideoForm extends Component {

	state = {
		mediaId: this.props.mediaId,
		videoCloudId: this.props.initialValues.cloudinary_file_id || null,
		opacityValue: new Animated.Value(0),
		translateXValue: new Animated.Value(TRANSLATE_X),
		activeHandle: null,
		localUri: null,
	}

	componentDidMount() {
		this.animateIn()
	}

	componentWillReceiveProps(nextProps) {
		const { activeField } = nextProps

		// set active field handle for scroll
		if (this.props.activeField !== activeField) {
			const handle = findNodeHandle(this[`Field_${activeField}`])

			this.setState({ activeHandle: handle })
		}
	}

	onEditVideoPress = () => {
		const { userId, change } = this.props

		ImagePicker.showImagePicker({ mediaType: 'video' }).then((video) => {
			if (video.uri) {
				this.setState({ localUri: video.localUri })
				change('cloudinary_file_id', video.uri)
			}
		}).catch(() => {})
	}

	animateIn = () => {
		const { stagger, spring } = Animated

		this.setState({ open: true })

		stagger(150, [
			spring(this.state.opacityValue, {
				toValue: 1,
				friction: 10,
				useNativeDriver: true,
			}),
			spring(this.state.translateXValue, {
				toValue: 0,
				friction: 8,
				useNativeDriver: true,
			}),
		]).start()
	}

	handleFocusNext = (field) => {
		const { name } = field.props

		if (name) {
			const input = field.getRenderedComponent().refs[name]

			if (input) {
				input.focus()
			}
		}
	}

	render() {
		const {
			attempting,
			handleSubmit,
			valid,
			onSubmit,
			onDelete,
		} = this.props
		const { mediaId, videoCloudId, localUri } = this.state
		const canAttempt = (localUri || videoCloudId) && !attempting && valid

		return (
			<Animated.View style={[styles.container, { opacity: this.state.opacityValue }]}>
				<TouchableOpacity
					style={styles.video}
					activeOpacity={(mediaId > 0) ? 1 : 0.8}
					onPress={(mediaId > 0) ? () => null : this.onEditVideoPress}
				>
					<View style={{ flex: 1 }}>
						{localUri
							? (
								<VideoPlayer source={localUri} />
							)
							: (
								<CloudinaryImage
									key={`ProfileVideoFormImage_${mediaId}`}
									publicId={videoCloudId}
									placeholder="avatar-centre"
									placeholderColor="white"
									placeholderSize={size(50)}
									width={VIDEO_WIDTH}
									height={VIDEO_HEIGHT}
									options="poster"
								/>
							)
						}

					</View>
				</TouchableOpacity>
				<Animated.View style={{ flex: 1, transform: [{ translateX: this.state.translateXValue }] }}>
					<Form
						style={styles.form}
						behaviour="scroll"
						activeHandle={this.state.activeHandle}
					>
						<View ref={(c) => { this.Field_title = c }}>
							<Field
								ref={(c) => { this.title = c }}
								withRef
								name="title"
								label="Title"
								component={TextField}
								keyboardType="default"
								returnKeyType="next"
								autoCorrect={false}
								editable={!attempting}
								disabled={attempting}
								onSubmitEditing={() => this.handleFocusNext(this.description)}
							/>
						</View>
						<View ref={(c) => { this.Field_description = c }}>
							<Field
								ref={(c) => { this.description = c }}
								withRef
								name="description"
								label="Description"
								component={TextField}
								keyboardType="default"
								autoCorrect={false}
								multiline
								editable={!attempting}
								disabled={attempting}
							/>
						</View>
						<View ref={(c) => { this.Field_tags = c }}>
							<Field
								ref={(c) => { this.tags = c }}
								withRef
								name="tags"
								label="Tags"
								component={TagField}
								keyboardType="default"
								editable={!attempting}
								disabled={attempting}
							/>
						</View>
						<View ref={(c) => { this.Field_is_public = c }}>
							<Field
								ref={(c) => { this.is_public = c }}
								withRef
								name="is_public"
								label="Privacy"
								options={{ 0: 'Only Me', 1: 'Anyone' }}
								component={RadioField}
								editable={!attempting}
								disabled={attempting}
							/>
						</View>
						<View style={styles.buttons}>
							{(mediaId > 0) &&
								<Button
									key={`VideoDeleteButton_${attempting}`}
									style={{ flex: 1, marginRight: size(15) }}
									type="outline"
									color={ss.constants.COLOR_ACCENT_RED}
									label="Delete"
									isLoading={attempting}
									disabled={attempting}
									onPress={onDelete}
								/>
							}
							<Button
								key={`VideoSubmitButton_${attempting}`}
								style={{ flex: 1 }}
								label={mediaId ? 'Update' : 'Upload'}
								isLoading={attempting}
								disabled={!canAttempt}
								onPress={handleSubmit(onSubmit)}
							/>
						</View>
					</Form>
				</Animated.View>
			</Animated.View>
		)
	}
}

ProfileVideoForm.propTypes = {
	userId: PropTypes.number.isRequired,
	mediaId: PropTypes.number.isRequired,
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.shape({
		cloudinary_file_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		is_public: PropTypes.string,
	}).isRequired,
	activeField: PropTypes.string,
	errors: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
}

ProfileVideoForm.defaultProps = {
	activeField: null,
	errors: null,
}


// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
	},
	video: {
		height: VIDEO_HEIGHT,
		backgroundColor: 'black',
	},
	form: {
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingHorizontal: size(20),
		paddingVertical: size(30),
	},
	buttons: {
		flexDirection: 'row',
		marginTop: size(20),
	},
})

// Form
const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}
	// local validation
	FormUtil.validate(values, errors, 'cloudinary_file_id').required()
	FormUtil.validate(values, errors, 'title').required()
	FormUtil.validate(values, errors, 'description').required()

	// api validation
	if (apiErrors && apiErrors.title) errors.title = apiErrors.title
	if (apiErrors && apiErrors.description) errors.description = apiErrors.description

	return errors
}

const ProfileVideoFormComponent = reduxForm({
	form: 'profileVideoForm',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(ProfileVideoForm)

export default ProfileVideoFormComponent
