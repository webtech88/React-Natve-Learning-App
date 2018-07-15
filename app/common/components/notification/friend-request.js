import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
} from 'react-native'

import { connect } from 'react-redux'
import CommunityActions from '../../../community/actions/creator'

import ss from '../../../styles'
import Button from '../core/button'
import TransText from '../core/transtext'


class FriendRequest extends Component {

	render() {
		const {
			action,
			attempting,
			success,
			error,
			manageConnection,
		} = this.props
		let rendered = null

		if (success || error) {
			rendered = <TransText style={styles.p} traskey={success || error} />
		} else {
			rendered = (
				<View style={styles.buttons}>
					<Button
						style={[styles.button, { marginRight: size(10) }]}
						height={size(30)}
						color={ss.constants.COLOR_CORE_BRAND}
						label="Accept"
						isLoading={(action === 'accept' && attempting) || false}
						disabled={attempting}
						onPress={() => manageConnection('accept')}
					/>
					<Button
						style={styles.button}
						height={size(30)}
						type="outline"
						color={ss.constants.COLOR_CORE_BRAND}
						label="Decline"
						isLoading={(action === 'decline' && attempting) || false}
						disabled={attempting}
						onPress={() => manageConnection('decline')}
					/>
				</View>
			)
		}

		return rendered
	}

}

FriendRequest.propTypes = {
	memberId: PropTypes.number.isRequired,
	action: PropTypes.string.isRequired,
	attempting: PropTypes.bool.isRequired,
	success: PropTypes.string,
	error: PropTypes.string,
	manageConnection: PropTypes.func.isRequired,
}

FriendRequest.defaultProps = {
	success: '',
	error: '',
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	buttons: {
		flex: 1,
		flexDirection: 'row',
		marginBottom: size(10),
	},
	button: {
		width: size(90),
	},
	p: {
		...p,
		fontSize: size(12),
	},
})


const mapStateToProps = state => ({
	manageConnections: state.community.manageConnections,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { manageConnections } = stateProps
	const { dispatch } = dispatchProps
	const { memberId } = ownProps
	const manageConnection = manageConnections && manageConnections[memberId]

	return {
		...ownProps,
		action: (manageConnection && manageConnection.action) || 'accept',
		attempting: (manageConnection && manageConnection.attempting) || false,
		success: (manageConnection && manageConnection.success) || null,
		error: (manageConnection && manageConnection.error) || null,
		manageConnection: action => dispatch(CommunityActions.manageConnectionAttempt(memberId, action)),
	}
}

export default connect(mapStateToProps, null, mergeProps)(FriendRequest)
