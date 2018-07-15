import React, { Component } from 'react'
import {
	View,
	Platform,
} from 'react-native'

import SortableListView from 'react-native-sortable-listview'

import common from '../../../common'

import ActivityDescription from './activity-description'
import ActivityHeader from './activity-header'
import DraggableCard from './draggable-wrapper'
import ActivityButtons from './activity-buttons'
import ActivityImage from './activity-image'

import ss from '../../../styles'

const { shuffle } = common.util.helpers

class DragActivity extends Component {

	constructor(props) {
		super(props)
		const { activity, order } = props

		const content = activity.content
		const selected = []
		const initialOrder = content.items.asMutable({ deep: true }).map((el, i) => ({ ...el, initialIndex: i }))
		const shuffledOrder = order ? initialOrder : shuffle(initialOrder)
		const data = shuffledOrder.reduce((acc, cur, i) => {
			acc[`_${i}`] = cur
			acc[`_${i}`].id = `_${i}`
			if (order) {
				acc[`_${i}`].index = order[i].index
				if (order[i].selected) {
					selected.push(`_${i}`)
				}
			} else {
				acc[`_${i}`].index = i
			}

			return acc
		}, {})

		let newOrder = new Array(Object.keys(data).length)
		if (order) {
			order.map((el, i) => newOrder[el.index] = `_${i}`)
		} else {
			newOrder = Object.keys(data)
		}
		this.state = {
			orderData: data,
			order: newOrder,
			selected,
		}
	}

	handleSelected = (id) => {
		const { onChange } = this.props
		const { selected } = this.state

		if (selected.indexOf(id) < 0) {
			selected[selected.length] = id
			this.setState({ selected }, () => this.handleSelectedChange(selected))
		}
	}

	handleOrderChange = orderData => this.props.onChange('input0', Object.keys(orderData).map(key =>
			({
				index: orderData[key].initialIndex,
				selected: this.state.selected.indexOf(this.state.orderData[key].id) > -1 }
			)),
	)

	handleSelectedChange = selected => this.props.onChange('input0',
		Object.keys(this.state.orderData).map(key =>
			({
				index: this.state.orderData[key].initialIndex,
				selected: selected.indexOf(this.state.orderData[key].id) > -1 }
			)),
	)

	renderHeader = activity => (
		<View>
			<ActivityHeader activity={activity} />
			<ActivityImage />
			<ActivityDescription
				description={activity.content.activityText}
				style={[styles.description, styles.contentContainer]}
			/>
		</View>
	)

	renderFooter = () => {
		const { canSubmit, saving, onSave, submitting, onSubmit } = this.props

		return (
			<View style={styles.contentContainer}>
				<ActivityButtons
					canSubmit={canSubmit}
					saving={saving}
					onSavePress={onSave}
					submitting={submitting}
					onSubmitPress={onSubmit}
				/>
			</View>
		)
	}


	// #TODO improve height of the cards when moving them around (when the selected state changes)
	render() {
		const { orderData, order, selected } = this.state
		const { activity, canModify, saving, submitting, onChange } = this.props

		return orderData && order && (
			<SortableListView
				activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
				renderHeader={() => this.renderHeader(activity)}
				renderFooter={this.renderFooter}
				style={styles.container}
				disableSorting={!canModify}
				data={orderData}
				order={order}
				rowHasChanged={(r1, r2) => r1.index !== r2.index || selected.indexOf(r2.id) > -1}
				onRowMoved={(e) => {
					order.splice(e.to, 0, order.splice(e.from, 1)[0])

					Object.keys(orderData).map(el => orderData[el].index = order.indexOf(el.toString()))
					this.setState({ order, orderData }, () => this.handleOrderChange(orderData))
				}}
				renderRow={row =>
					(<DraggableCard
						item={row}
						canModify={canModify || !saving || !submitting}
						selected={selected.indexOf(row.id) > -1}
						onPress={id => this.handleSelected(id)}
					/>)
				}
			/>
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
	description: {
		paddingTop: size(22),
	},
	contentContainer: {
		paddingHorizontal: size(15),
	},
})

export default DragActivity
