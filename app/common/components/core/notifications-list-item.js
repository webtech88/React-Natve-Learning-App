import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Image,
	TouchableOpacity,
} from 'react-native'

import moment from 'moment-timezone'

import ss from '../../../styles'

import Button from './button'
import CloudinaryImage from './cloudinary-image'
import Loading from './loading'
import TransText from './transtext'
import notification from '../notification'

const { FriendRequest } = notification


const NotificationsListItem = ({
	notification,
	onPress,
}) => {
	let image
	let borderRadius = false // set to true for friend requests, etc.
	let event
	let title
	let created
	let body = null
	let message

	switch (notification.meta.event) {
	case 'friend_request':
		image = notification.body.cloudinary_file_id
		borderRadius = true
		event = 'Friend request'
		title = notification.body.screen_name
		created = notification.meta.created
		body = (
			<FriendRequest
				key={`Notification_Friend_Request_${notification.meta.sender}`}
				memberId={notification.meta.sender}
			/>
		)
		// message = 'This is a message.'
		break
	default:
		// TODO waiting on api for other events
		return null
	}

	return (
		<TouchableOpacity style={styles.notification}
			activeOpacity={0.9}
			onPress={() => onPress(notification)}
		>
			{image &&
				<View>
					<CloudinaryImage
						style={styles.image}
						publicId={image}
						width={size(65)}
						height={size(65)}
						borderRadius={borderRadius ? size(65) : 0}
						options="profile"
					/>
				</View>
			}
			<View style={{ flex: 1 }}>
				<View style={styles.header}>
					<TransText style={styles.title} transkey={title} />
					{/* {notification.pending
						? <Loading />
						: <TouchableOpacity
							activeOpacity={0.85}
							onPress={() => console.log('remove notification')}
						>
							<Image
								resizeMode="contain"
								// source={dismissed ? ss.images.iconDelete : ss.images.iconNavClose}
								source={ss.images.iconNavClose}
							/>
						</TouchableOpacity>
					} */}
				</View>
				<View style={styles.meta}>
					<TransText style={styles.event} transkey={event} />
					<TransText style={styles.date} transkey={moment(created).fromNow()} />
				</View>
				{body}
				{/* {notification.meta.event === 'friend_request' &&
					<View style={styles.row}>
						<View style={styles.buttons}>
							<Button
								style={[styles.button, { marginRight: size(10) }]}
								height={size(30)}
								color={ss.constants.COLOR_CORE_BRAND}
								label="Accept"
								onPress={() => null}
							/>
							<Button
								style={styles.button}
								height={size(30)}
								type="outline"
								color={ss.constants.COLOR_CORE_BRAND}
								label="Decline"
								onPress={() => null}
							/>
						</View>
					</View>
				}

				{message && <TransText style={styles.body} transkey={message}>}

				<TransText style={styles.status} transkey="ACCEPT_FRIEND_REQUEST"> */}
			</View>
		</TouchableOpacity>
	)
}

NotificationsListItem.propTypes = {
	notification: PropTypes.shape({
		body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		meta: PropTypes.object,
		// pending: PropTypes.bool
	}).isRequired,
	onPress: PropTypes.func,
}

NotificationsListItem.defaultProps = {
	onPress: null,
}


// StyleSheet
const {
	size,
	typo: { p, pSemiBold, link },
} = ss

const styles = ss.create({
	notification: {
		backgroundColor: 'white',
		borderRadius: size(5),
		padding: size(10),
		flexDirection: 'row',
		marginBottom: size(10),
		shadowColor: 'black',
		shadowOpacity: 0.1,
		shadowRadius: 0.5,
		shadowOffset: {
			height: 1,
			width: 0,
		},
		elevation: size(2),
	},
	image: {
		backgroundColor: '#EEEEEE',
		borderRadius: size(65),
		marginRight: size(10),
	},
	header: {
		flexDirection: 'row',
		marginBottom: size(5),
	},
	title: {
		...pSemiBold,
		flex: 1,
	},
	meta: {
		flexDirection: 'row',
		marginBottom: size(10),
	},
	event: {
		...link,
		fontSize: size(12),
		marginRight: size(10),
	},
	date: {
		...p,
		fontSize: size(12),
		opacity: 0.7,
	},
	body: {
		...p,
		fontSize: size(14),
		flex: 1,
		// marginBottom: size(10),
	},
})


export default NotificationsListItem
