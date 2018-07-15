import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
	Modal,
	ScrollView,
	TouchableOpacity,
} from 'react-native'

import ActivityListCard from './activity-list-card'

import ss from '../../../styles'
import common from '../../../common'

const { TransText, Icon } = common.components.core

const getRandomId = () => Math.random().toString(36).substr(2, 10)

class AreasModal extends Component {

	renderCard = (item, selected = false) => (
		<TouchableOpacity activeOpacity={0.5} onPress={() => this.props.onAreaSelected(item.id)} key={getRandomId()}>
			<ActivityListCard text={item.value} selected={selected} />
		</TouchableOpacity>
	)

	render() {
		const { areas, selected, closeModal } = this.props

		return (
			<Modal
				animationType={'slide'}
				transparent
				visible={this.props.isVisible}
			>
				<View style={styles.background} />
				<View style={styles.container}>
					<ScrollView
						showsVerticalScrollIndicator
						style={styles.scrollView}
						contentContainerStyle={styles.contentContainer}
						centerContent
					>
						<TransText style={styles.header} transkey="SELECT_SECTOR" />
						{areas.map(item => this.renderCard(item, selected === item.id))}
					</ScrollView>
					<TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
						<Icon name="cancel" />
					</TouchableOpacity>
				</View>
			</Modal>
		)
	}

}

AreasModal.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	areas: PropTypes.arrayOf(PropTypes.object).isRequired,
	selected: PropTypes.string,
	onAreaSelected: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
}

AreasModal.defaultProps = {
	selected: '',
	onAreaSelected: () => {},
}

// StyleSheet
const {
	size,
	typo: { h1 },
} = ss

const styles = ss.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	background: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: ss.constants.COLOR_CORE_LIGHT,
		opacity: 0.9,
	},
	contentContainer: {
		paddingHorizontal: size(30),
		android: {
			paddingBottom: ss.constants.HEIGHT_NAV_BAR, // NOTE: Too big? Maybe - size(10)?
		},
	},
	scrollView: {
		paddingVertical: size(10),
		android: {
			paddingTop: size(40),
		},
	},
	header: {
		...h1,
		fontSize: size(26),
		textAlign: 'center',
		android: {
			marginBottom: size(10),
		},
	},
	closeIcon: {
		position: 'absolute',
		ios: {
			top: size(36),
		},
		android: {
			top: size(10),
		},
		left: 8,
	},
})

export default AreasModal
