import React, { Component } from 'react'
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
} from 'react-native'

import common from '../../../common'

import ActivityListCard from './activity-list-card'
import ActivityDescription from './activity-description'
import ActivityHeader from './activity-header'
import AreasPickerModal from './activity-areas-modal'
import ActivityButtons from './activity-buttons'
import ActivityImage from './activity-image'

import ss from '../../../styles'

const EMPTY_AREA_LABEL = 'Tap on options above to add'
const { shuffle } = common.util.helpers

const renderEmptyCard = () => (
	<View style={styles.container}>
		<View style={styles.border} >
			<Text style={styles.emptyCardLabel}>{EMPTY_AREA_LABEL}</Text>
		</View>
	</View>
)

const getRandomId = () => Math.random().toString(36).substr(2, 10)

class AreaActivity extends Component {
	constructor(props) {
		super(props)
		const { activity, selected } = props

		let data = activity.content.items.asMutable({ deep: true }).map((item, index) => ({ ...item, index }))
		const realSelection = {}
		if (selected) {
			const usedIndexes = []
			Object.keys(selected).map(area => selected[area].map((el) => {
				if (realSelection[area]) {
					realSelection[area].push(data[el])
				} else {
					realSelection[area] = [data[el]]
				}
				usedIndexes.push(el)
			}))

			data = data.filter(i => !usedIndexes.includes(i.index))
		} else {
			shuffle(data)
		}


		this.state = {
			basicList: data,
			selection: realSelection,
			isPickerModalOpen: false,
			activeElement: null,
		}
	}

	openPickerModal = item => this.setState({ isPickerModalOpen: true, activeElement: item })

	handleFormChange = (selection) => {
		const newSelection = {}
		Object.keys(selection).map((area) => { newSelection[area] = selection[area].map(el => el.index) })

		this.props.onChange('input0', newSelection)
	}


	handleAreaSelection = (id) => {
		const { onChange } = this.props
		const { selection, basicList, activeElement } = this.state

		if (basicList.filter(el => el.index === activeElement.index).length > 0) {
			if (selection[`${id}`]) {
				selection[`${id}`].push(activeElement)
			} else {
				selection[`${id}`] = [activeElement]
			}
			const filtered = basicList.filter(el => el.index !== activeElement.index)

			return this.setState({ isPickerModalOpen: false, selection, basicList: filtered }, () => this.handleFormChange(selection))
		}
		const currentArea = Object.keys(selection)
			.filter(el => selection[el] && selection[el].indexOf(activeElement) > -1)[0]

		if (currentArea === id) {
			return this.setState({ isPickerModalOpen: false })
		}

		const filtered = selection[currentArea].filter(el => el.index !== activeElement.index)
		selection[currentArea] = filtered

		if (selection[`${id}`]) {
			selection[`${id}`].push(activeElement)
		} else {
			selection[`${id}`] = [activeElement]
		}

		return this.setState({ isPickerModalOpen: false, selection }, () => this.handleFormChange(selection))
	}

	closeModal = () => this.setState({ isPickerModalOpen: false, activeIndex: null })

	renderCard = (item, selected = false) => {
		const { canModify, saving, submitting } = this.props
		const Card = (canModify || !saving || !submitting) ? TouchableOpacity : View

		return (
			<Card onPress={() => this.openPickerModal(item)} key={getRandomId()}>
				<ActivityListCard image={item.image || null} text={item.title} selected={selected} />
			</Card>
		)
	}

	renderArea = (title, elements) => (
		<View key={getRandomId()}>
			<View style={styles.separator} />
			<Text style={styles.areaTitle} numberOfLines={2}>{title}</Text>
			{elements.length === 0 && renderEmptyCard()}
			{elements.map(item => this.renderCard(item, true))}
		</View>
	)

	render() {
		const {
			activity: { content: { titles, activityText } },
			canSubmit,
			saving,
			onSave,
			submitting,
			onSubmit,
		} = this.props
		const { basicList } = this.state

		return (
			<View style={styles.container}>
				<ScrollView
					keyboardDismissMode="interactive"
					keyboardShouldPersistTaps="never"
					showsVerticalScrollIndicator
				>
					<ActivityHeader activity={this.props.activity} />
					<ActivityImage />
					<View style={styles.contentContainer}>
						<ActivityDescription description={activityText} style={styles.description} />
						{basicList.map(item => this.renderCard(item, false))}
						{titles.map(area => this.renderArea(area.value, this.state.selection[area.id] || []))}
						<ActivityButtons
							canSubmit={canSubmit}
							saving={saving}
							onSavePress={onSave}
							submitting={submitting}
							onSubmitPress={onSubmit}
						/>
					</View>
				</ScrollView>
				<AreasPickerModal
					isVisible={this.state.isPickerModalOpen}
					areas={titles}
					onAreaSelected={this.handleAreaSelection}
					closeModal={this.closeModal}
				/>
			</View>
		)
	}

}

// StyleSheet
const {
	size,
	typo: { h1, p },
} = ss

const styles = ss.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: size(15),
	},
	separator: {
		height: size(3),
		paddingHorizontal: size(3),
		backgroundColor: '#f9f9f9',
		marginVertical: size(22),
	},
	areaTitle: {
		...h1,
		color: ss.constants.COLOR_CORE_BRAND,
		fontSize: size(20),
		paddingBottom: size(18),
	},
	emptyCardLabel: {
		...p,
		fontSize: size(16),
		paddingVertical: size(14),
		opacity: 0.5,
		color: ss.constants.COLOR_CORE_DARK,
		textAlign: 'center',
	},
	border: {
		borderStyle: 'dashed',
		borderWidth: 1,
		borderRadius: 2,
		backgroundColor: ss.constants.COLOR_CORE_LIGHT,
		borderColor: 'rgba(0, 48, 87, 0.5)',
	},
	description: {
		paddingTop: size(22),
	},
})

export default AreaActivity
