import PropTypes from 'prop-types'
import React from 'react'
import {
	TouchableOpacity,
	View,
} from 'react-native'

import ss from '../../../styles'
import Icon from '../core/icon'
import TransText from '../core/transtext'

const MediaTag = ({
	suggested,
	tag,
	onPress,
	onDeletePress,
	editable,
}) => {
	const Tag = suggested ? TouchableOpacity : View
	return (
		<Tag
			style={[styles.tag, suggested && styles.suggestedTag]}
			activeOpacity={0.9}
			onPress={() => onPress(tag)}
		>
			<TransText style={styles.tagText} transkey={tag} />
			{!suggested && editable && <TouchableOpacity onPress={() => onDeletePress(tag)} activeOpacity={0.9}>
				<Icon name="close" size={ss.size(10)} style={styles.closeTag} />
				</TouchableOpacity>}
		</Tag>
	)
}

MediaTag.propTypes = {
	tag: PropTypes.string.isRequired,
	onPress: PropTypes.func,
	suggested: PropTypes.bool,
	onDeletePress: PropTypes.func,
	editable: PropTypes.bool,
}

MediaTag.defaultProps = {
	onPress: () => {},
	onDeletePress: () => {},
	suggested: false,
	editable: false,
}

const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	tag: {
		backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
		paddingVertical: size(5),
		paddingHorizontal: size(10),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: size(5),
		marginBottom: size(5),
		flexDirection: 'row',
		borderRadius: size(5),
	},
	suggestedTag: {
		backgroundColor: 'white',
		borderColor: ss.constants.COLOR_CORE_SECONDARY,
		borderWidth: 1,
	},
	tagText: {
		...p,
		color: ss.constants.COLOR_HEADING,
	},
	closeTag: {
		marginLeft: size(10),
	},
})

export default MediaTag
