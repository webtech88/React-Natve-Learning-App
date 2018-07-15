import PropTypes from 'prop-types'
// TODO to be moved to notification module

import React, { Component } from 'react'
import {
	View,
	FlatList,
} from 'react-native'

import NotificationsListItem from './notifications-list-item'


class NotificationsListView extends Component {

	render() {
		const { style, notifications, onPress, ...otherProps } = this.props

		return (
			<View style={{ flex: 1 }}>
				<FlatList
					style={style}
					data={notifications}
					keyExtractor={item => item.meta.notification_id}
					renderItem={({ item }) =>
						<NotificationsListItem notification={item} onPress={onPress} />
					}
					{...otherProps}
				/>
			</View>
		)
	}

}

NotificationsListView.propTypes = {
	notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
	onPress: PropTypes.func.isRequired,
}

NotificationsListView.defaultProps = {
	style: null,
}

export default NotificationsListView
