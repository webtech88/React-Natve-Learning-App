import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	FlatList,
	View,
	Text,
	Animated,
} from 'react-native'

import WorkbookListItem from './workbook-list-item'
import common from '../../common'

import ss from '../../styles'

const { Button, TransText } = common.components.core
const HEIGHT_HALF = ss.constants.HEIGHT_DEVICE / 1

class WorkbookListView extends Component {

	constructor(props) {
		super(props)

		this.state = {
			animTransform: new Animated.Value(this.props.animated ? HEIGHT_HALF : 0),
		}
	}

	componentDidMount() {
		if (this.props.animated) {
			Animated.spring(this.state.animTransform, {
				toValue: 0,
				friction: 10,
				useNativeDriver: true,
			}).start()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.visible !== nextProps.visible && !nextProps.visible) {
			// NOTE container will pop after animated out
			this.props.onUnmount()
		}
	}

	render() {
		const { style, workbooks, animated, onPress, contactCentre } = this.props

		if (workbooks && workbooks.length) {
			return (
				<Animated.View style={{ flex: 1, transform: [{ translateY: this.state.animTransform }] }}>
					<FlatList
						style={style}
						data={workbooks}
						renderItem={({ item, index }) => (
							<View style={{ flex: 1 }}>
								{(index > 0) && <View style={styles.separator} />}
								<WorkbookListItem
									workbook={item}
									onPress={onPress}
									animated={animated}
								/>
							</View>
						)}
						keyExtractor={item => item.workbook_id}
					/>
				</Animated.View>
			)
		}

		return (
			<View style={styles.empty}>
				<TransText style={styles.emptyTitle} transkey="NO_WORKBOOK" />
				<Text style={styles.emptyMessage} transkey="WORKBOOK_NOT_READY" />
				{contactCentre && (
					<Button style={styles.contactButton} label="Contact centre" onPress={contactCentre} />
				)}
			</View>
		)
	}

}

WorkbookListView.propTypes = {
	visible: PropTypes.bool,
	animated: PropTypes.bool,
	workbooks: PropTypes.array.isRequired,
	onPress: PropTypes.func.isRequired,
	onUnmount: PropTypes.func,
	contactCentre: PropTypes.func,
}

WorkbookListView.defaultProps = {
	visible: false,
	animated: true,
	onUnmount: () => null,
	contactCentre: null,
}

// StyleSheet
const {
	size,
	typo: { h1, pLight },
} = ss

const styles = ss.create({
	empty: {
		backgroundColor: '#F4F3F5',
		flex: 1,
		justifyContent: 'center',
		padding: size(20),
	},
	emptyTitle: {
		...h1,
		marginBottom: size(10),
	},
	emptyMessage: {
		...pLight,
		fontSize: size(18),
	},
	contactButton: {
		paddingTop: 20,
	},
	separator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
})


export default WorkbookListView
