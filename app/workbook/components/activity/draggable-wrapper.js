import React from 'react'
import {
	View,
	TouchableOpacity,
	Platform,
} from 'react-native'

import ActivityListCard from './activity-list-card'

import ss from '../../../styles'

const DraggableCard = ({
	item,
	canModify,
	sortHandlers,
	onPress,
	selected,
}) => {
	const Card = canModify ? TouchableOpacity : View
	const onLongPress = (e) => {
		sortHandlers.onLongPress(e)
	}
	const onPressOut = (e) => {
		sortHandlers.onPressOut(e)
		onPress(item.id)
	}

	return (
		<Card
			activeOpacity={Platform.OS === 'ios' ? 0.5 : 1}
			{...sortHandlers}
			style={styles.container}
			onPress={() => onPress(item.id)}
			onLongPress={e => onLongPress(e)}
			onPressOut={e => onPressOut(e)}
		>
			<ActivityListCard
				index={selected ? item.index : null}
				selected={selected}
				image={item.image || null}
				text={item.title}
				draggable
			/>
		</Card>
	)
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
		paddingHorizontal: size(15),
	},
})


export default DraggableCard
