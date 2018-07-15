import PropTypes from 'prop-types'
import React from 'react'
import {
	TouchableOpacity,
	View,
	Text,
} from 'react-native'

import PrevNextSvg from './prev-next-activity'

import ss from '../../../styles'
import common from '../../../common'

const { TransText } = common.components.core

const ActivityPagination = ({
	currentPage,
	totalPages,
    onScrollForward,
    onScrollBackwards,
    onScrollToEnd,
}) => {
	const isNextDisabled = currentPage === totalPages
	const isPreviousDisabled = currentPage === 1

	return (
		<View style={styles.paginationContainer} >
			<TransText 
				style={styles.pageCounter}
				transkeys={[currentPage, ' ', 'from', ' ', totalPages]}
				tindices={[2]}
			/>
			<View style={styles.buttonsContainer}>
				<View style={styles.borderRight}>
					<TouchableOpacity
						style={styles.singleArrowContainer}
						onPress={isPreviousDisabled ? null : () => onScrollBackwards()}
					>
						<PrevNextSvg type="previous" disabled={isPreviousDisabled} />
					</TouchableOpacity>
				</View>
				<View style={styles.borderRight}>
					<TouchableOpacity
						style={styles.singleArrowContainer} disabled={isNextDisabled}
						onPress={isNextDisabled ? null : () => onScrollForward()}
					>
						<PrevNextSvg disabled={isNextDisabled} />
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={styles.doubleArrowContainer}
					onPress={isNextDisabled ? null : () => onScrollToEnd()}
				>
					<PrevNextSvg double disabled={isNextDisabled} />
				</TouchableOpacity>
			</View>
		</View>
	)
}

ActivityPagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onScrollForward: PropTypes.func.isRequired,
	onScrollBackwards: PropTypes.func.isRequired,
	onScrollToEnd: PropTypes.func.isRequired,
}

ActivityPagination.defaultProps = {
	currentPage: 0,
	totalPages: 0,
	onScrollForward: () => {},
	onScrollBackwards: () => {},
	onScrollToEnd: () => {},
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	paginationContainer: {
		backgroundColor: '#f7f7f7',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 20,
		justifyContent: 'space-around',
	},
	pageCounter: {
		...p,
		opacity: 0.5,
	},
	buttonsContainer: {
		flexDirection: 'row',
		backgroundColor: ss.constants.COLOR_CORE_LIGHT,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: ss.constants.COLOR_TINT_LIGHTER,
	},
	singleArrowContainer: {
		paddingHorizontal: size(25),
	},
	borderRight: {
		borderRightWidth: 1,
		borderRightColor: ss.constants.COLOR_TINT_LIGHTER,
	},
	doubleArrowContainer: {
		paddingHorizontal: size(10),
	},
})

export default ActivityPagination
