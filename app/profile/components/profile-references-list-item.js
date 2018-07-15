import React, { Component } from 'react'
import {
	View,
	Text,
	Switch,
	Platform,
} from 'react-native'

import moment from 'moment-timezone'

import ss from '../../styles'
import common from '../../common'

const { CloudinaryImage, ReadMoreText, TransText } = common.components.core


class ProfileReferencesListItem extends Component {

	state = {
		switchValue: !!this.props.reference.status,
		switchWidth: 0,
	}

	componentWillReceiveProps(nextProps) {
		if (!!nextProps.reference.status !== this.state.switchValue) {
			this.setState({ switchValue: !!nextProps.reference.status })
		}
	}

	toggleSwitch = () => {
		this.setState({ switchValue: !this.state.switchValue })

		if (this.props.onUpdate) {
			this.props.onUpdate()
		}
	}

	render() {
		const {
			reference: {
				reference_id,
				reference,
				sender_cloudinary_file_id,
				sender_screen_name,
				sender_gender,
				created,
				status,
				updatingReference,
			},
			onUpdate,
		} = this.props
		const photoDimensions = size(50)

		let switchProps

		if (Platform.OS === 'android') {
			if (this.state.switchValue) {
				switchProps = {
					onTintColor: 'rgba(0, 0, 0, .25)',
					thumbTintColor: ss.constants.COLOR_CORE_BRAND,
				}
			} else {
				switchProps = {
					tintColor: 'rgba(0, 0, 0, .25)',
				}
			}
		} else {
			switchProps = {
				onTintColor: ss.constants.COLOR_CORE_BRAND,
			}
		}

		return (
			<View style={styles.listItem}>
				<View style={styles.referenceContainer}>
					<ReadMoreText style={styles.reference} numberOfLines={4}>{`"${reference}"`}</ReadMoreText>
				</View>
				<View style={styles.referee}>
					<CloudinaryImage
						key={`ReferencesItemImage_${reference_id}`}
						style={{
							marginRight: size(10),
							backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
						}}
						publicId={sender_cloudinary_file_id}
						placeholder={sender_gender === 2 ? 'avatar-female' : 'avatar-male'}
						placeholderSize={size(25)}
						width={photoDimensions}
						height={photoDimensions}
						borderRadius={photoDimensions}
						options="profile"
					/>
					<View style={{ flex: 1 }}>
						<Text style={styles.name}>{sender_screen_name}</Text>
						<Text style={styles.date}>{moment(created).format('D MMMM YYYY')}</Text>
					</View>
				</View>
				{onUpdate &&
					<View>
						<View style={[styles.switchDivider, { marginRight: size(20) + this.state.switchWidth }]} />
						<View style={styles.switchContainer}>
							<TransText style={styles.switchText} transkey="SHOW_ON_CV"/>
							<Switch
								disabled={updatingReference}
								value={this.state.switchValue}
								onValueChange={this.toggleSwitch}
								onLayout={e => this.setState({ switchWidth: e.nativeEvent.layout.width })}
								{...switchProps}
							/>
						</View>
					</View>
				}
			</View>
		)
	}
}

// StyleSheet
const {
	size,
	typo: { p, pSemiBold, pLight, link },
} = ss

const styles = ss.create({
	listItem: {
		padding: size(20),
	},
	referenceContainer: {
		marginBottom: size(10),
	},
	reference: {
		...pLight,
		color: ss.constants.COLOR_TEXT_PRIMARY,
		fontSize: size(18),
	},
	p: {
		...p,
	},
	referee: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	name: {
		...pSemiBold,
		fontSize: size(12),
		marginBottom: size(5),
	},
	date: {
		...p,
		fontSize: size(12),
		opacity: 0.7,
	},
	link: {
		...link,
	},
	switchContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	switchDivider: {
		backgroundColor: 'rgba(0, 0, 0, .1)',
		height: 1,
		marginTop: size(10),
		marginLeft: size(-20),
		marginBottom: size(10),
	},
	switchText: {
		...p,
		fontSize: size(14),
	},
})

export default ProfileReferencesListItem
