import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Platform,
} from 'react-native'

import { GiftedChat } from 'react-native-gifted-chat'
import moment from 'moment-timezone'

import ss from '../../styles'
import common from '../../common'

import ChatBubble from './chat-bubble'
import ChatTimestamp from './chat-timestamp'

const { CloudinaryImage, Loading, NoResults } = common.components.core

const {
	size,
	typo: { h2, link },
} = ss

const ConversationsCardItem = ({
	chat,
	cardWidth,
	onPress,
}) => {
	const renderMessage = (props) => {
		const isOwnMessage = props.position === 'right'
		let displayAvatar = false

		if (!isOwnMessage && (
			!props.previousMessage.user ||
			props.previousMessage.user._id !== props.currentMessage.user._id
		)) {
			displayAvatar = true
		}

		return (
			<View style={{ paddingHorizontal: size(10), marginBottom: size(10) }}>
				{renderDay(props, displayAvatar)}
				<View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
					{displayAvatar && renderAvatar(props)}
					{renderBubble(props, isOwnMessage, displayAvatar)}
				</View>
			</View>
		)
	}

	const renderDay = (props, displayAvatar) => {
		const time = moment(props.currentMessage.createdAt).format('Do MMM, HH:mm')
		const timePrevious = moment(props.previousMessage.createdAt).format('Do MMM, HH:mm')
		const isOwnMessage = props.position === 'right'
		if (time === timePrevious) {
			return null
		}

		return (
			<ChatTimestamp
				time={time}
				isOwnMessage={isOwnMessage}
				displayAvatar={displayAvatar}
			/>
		)
	}

	const renderAvatar = (props) => {
		const avatar = props.currentMessage.user.photo
		const gender = props.currentMessage.user.gender

		return (
			<CloudinaryImage
				style={styles.avatar}
				publicId={avatar}
				width={size(50)}
				height={size(50)}
				borderRadius={size(50)}
				options="profile"
				placeholder={gender === 2 ? 'avatar-female' : 'avatar-male'}
				placeholderSize={size(25)}
			/>
		)
	}

	const renderBubble = (props, isOwnMessage, displayAvatar) => {
		let messageStatus
		if (isOwnMessage) messageStatus = props.currentMessage.status

		return (
			<ChatBubble message={props.currentMessage.text.toString()}
				isOwnMessage={isOwnMessage}
				displayAvatar={displayAvatar}
				messageStatus={messageStatus}
				onResendMessagePress={() => null}
			/>
		)
	}

	const renderLoading = () => (
		<Loading />
	)

	const currentUser = chat && chat.participants.find(user => user.currentUser)
	const otherUser = chat.participants.find(user => !user.currentUser)
	const giftedMessages = chat && chat.messages && chat.messages.map((message) => {
		const isOwnMessage = message.object_id === currentUser.object_id
		return {
			_id: message.message_id,
			createdAt: new Date(moment(message.created)),
			user: {
				_id: isOwnMessage ? currentUser.object_id : otherUser.object_id,
				...(isOwnMessage ? currentUser : otherUser),
			},
			text: message.message,
			status: message.status || 'sent',
		}
	})

	const renderContent = () => {
		if (chat && !chat.messages) {
			return <Loading />
		}

		if (chat && !chat.messages.length) {
			return (
				<NoResults
					name="no-messages"
					size={size(40)}
					message="There are no messages here."
				/>
			)
		}

		return (
			<GiftedChat
				messages={giftedMessages}
				bottomOffset={0}
				minInputToolbarHeight={0}
				renderLoading={renderLoading}
				renderAvatarOnTop={false}
				renderMessageImage={() => null}
				// renderBubble={renderBubble}
				renderMessage={renderMessage}
				loadEarlier={false}
				// onLoadEarlier={this.onLoadMoreMessages}
				// isLoadingEarlier={gettingMessages}
				renderDay={renderDay}
				renderTime={() => null}
				renderInputToolbar={() => null}
				renderComposer={() => null}
				renderSend={() => null}
				user={{ _id: chat && currentUser.object_id }}
				onSend={() => null}
			/>
		)
	}


	return (
		<View style={{ flex: 1 }}>
			<View style={[styles.listItem, { width: cardWidth }]}>
				<View style={styles.header}>
					<Text style={styles.h2}>
						{`${chat.title} Chat`}
					</Text>
				</View>
				{renderContent()}
				{(chat && chat.messages) &&
					<TouchableOpacity
						style={styles.footer}
						activeOpacity={0.8}
						onPress={() => onPress(chat)}
					>
						<Text style={styles.link}>{chat && !chat.messages.length ? 'begin chat' : 'open chat'}</Text>
					</TouchableOpacity>
				}
			</View>
			{Platform.OS === 'ios' &&
				<View style={[styles.cardShadow, { width: cardWidth - size(100) }]} />
			}
		</View>
	)
}


ConversationsCardItem.propTypes = {
	cardWidth: PropTypes.number.isRequired,
	chat: PropTypes.object.isRequired,
	onPress: PropTypes.func.isRequired,
}


// StyleSheet
const styles = ss.create({
	listItem: {
		flex: 1,
		backgroundColor: 'white',
		android: {
			elevation: 2,
		},
	},
	header: {
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: ss.constants.COLOR_TINT_LIGHT,
		padding: size(15),
	},
	h2: {
		...h2,
		color: ss.constants.COLOR_TEXT_PRIMARY,
	},
	footer: {
		height: size(40),
		borderTopWidth: 1,
		borderTopColor: 'rgba(0, 0, 0, .1)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 1,
	},
	link: {
		...link,
	},
	cardShadow: {
		backgroundColor: 'white',
		// backgroundColor: 'red', // NOTE testing flexbox
		zIndex: -1,
		height: 50,
		top: 0,
		marginTop: -(51),
		alignSelf: 'center',
		shadowColor: 'black',
		shadowOffset: {
			height: 5,
			width: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 15,
	},
	avatar: {
		// marginLeft: size(10),
		backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
		marginRight: size(10),
	},
})

export default ConversationsCardItem
