import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	LayoutAnimation,
	View,
	Text,
	TouchableOpacity,
} from 'react-native'

import moment from 'moment-timezone'

import ss from '../../styles'
import common from '../../common'

const { CloudinaryImage, Icon } = common.components.core

const LayoutSpringAnim = {
	duration: 350,
	// duration: 2000,
	create: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
	update: {
		type: LayoutAnimation.Types.spring,
		property: LayoutAnimation.Properties.opacity,
		springDamping: 1.4,
	},
	delete: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
}


class ProfileBioListItem extends Component {

	state = {
		toggled: this.props.toggled,
	}

	toggleBioDescription = () => {
		LayoutAnimation.configureNext(LayoutSpringAnim)
		this.setState({ toggled: !this.state.toggled })
	}

	render() {
		const { bio, onEdit } = this.props
		const photoDimensions = size(50)
		const from_date = moment(bio.from_date).format('MMM YYYY')
		const to_date = bio.to_date ? moment(bio.to_date).format('MMM YYYY') : 'Present'
		let BioComponent = View
		let description = null

		if (bio.description) {
			BioComponent = TouchableOpacity
			description = (
				<View style={{ marginTop: size(10) }}>
					<Text style={styles.p}>{bio.description}</Text>
				</View>
			)
		}

		return (
			<BioComponent style={styles.bio} activeOpacity={0.95} onPress={this.toggleBioDescription}>
				{bio.cloudinary_file_id &&
					<CloudinaryImage
						style={styles.image}
						publicId={bio.cloudinary_file_id}
						placeholder="avatar-centre"
						placeholderSize={size(25)}
						width={photoDimensions}
						height={photoDimensions}
						options="thumb"
					/>
				}
				<View style={{ flex: 1 }}>
					<Text style={styles.title}>{bio.title}</Text>
					{bio.subtitle ? <Text style={styles.subtitle}>{bio.subtitle}</Text> : null}
					<Text style={styles.pSmall}>{from_date} - {to_date}{bio.location && ` | ${bio.location}`}</Text>
					{this.state.toggled && description}
				</View>
				{onEdit &&
					<TouchableOpacity
						style={styles.edit}
						activeOpacity={0.8}
						onPress={onEdit}
					>
						<Icon name="edit" size={ss.size(18)} />
					</TouchableOpacity>
				}
			</BioComponent>
		)
	}

}

ProfileBioListItem.propTypes = {
	toggled: PropTypes.bool.isRequired,
	bio: PropTypes.object.isRequired,
}

ProfileBioListItem.defaultProps = {
	toggled: false,
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	bio: {
		backgroundColor: 'white',
		// backgroundColor: 'green', // NOTE testing flexbox
		flexDirection: 'row',
		padding: size(20),
	},
	image: {
		marginRight: size(20),
		backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
		alignSelf: 'flex-start',
	},
	title: {
		...p,
		marginTop: -size(3),
		marginBottom: size(3),
	},
	subtitle: {
		...p,
		fontSize: size(14),
		opacity: 0.9,
		marginBottom: size(5),
	},
	p: {
		...p,
		fontSize: size(14),
	},
	pSmall: {
		...p,
		fontSize: size(12),
		opacity: 0.7,
	},
	edit: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		width: size(22),
		height: size(22),
		// padding: size(2),
		// marginTop: -size(5),
		// marginRight: -size(10),
	},
})


export default ProfileBioListItem
