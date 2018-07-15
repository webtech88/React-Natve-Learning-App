import PropTypes from 'prop-types'
import React from 'react'
import {
	Modal,
	View,
	Text,
	FlatList,
	TouchableOpacity,
} from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { NavBar, NavBarIconButton } = common.components.navigation
const { TransText, Icon } = common.components.core

const WorkbookChaptersModal = ({
		showChapters,
		toggleShowChapters,
		onPress,
		chapters,
		activeChapter,
}) => {
	const numberOfChapters = chapters ? chapters.length : 0

	return (
		<Modal
			animationType={'slide'}
			transparent={false}
			visible={showChapters}
			onRequestClose={() => null}
		>
			<View style={styles.wrapper}>
				<NavBar
					title="Chapters"
					navigationBarStyle={styles.navbar}
					renderLeftButton={() => (
						<NavBarIconButton name="cancel" onPress={toggleShowChapters} />
					)}
				/>
				<FlatList
					data={chapters}
					keyExtractor={(item, i) => `${item}_${i}`}
					ListHeaderComponent={() => (
						<View>
							<View style={styles.header}>
								<Icon name="chapters"
									size={ss.size(18)}
									style={styles.icon}
								/>
								<TransText 
									style={styles.numberOfChapters}
									transkeys={[numberOfChapters, ' ', 'CHAPTERS']}
									tindices={[2]}
								/>
							</View>
							<View style={styles.separator} />
						</View>
					)}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
					renderItem={({ item, index }) => {
						const chapterNo = parseInt(index, 10) + 1
						return (
							<TouchableOpacity style={styles.row}
								activeOpacity={0.7}
								onPress={() => onPress(index)}
							>
								<View style={styles.chapter}>
									<Text style={[
										styles.text,
										activeChapter === chapterNo && styles.activeText,
										{ width: ss.size(30) }]}
									>
										{chapterNo}
									</Text>
									<View style={styles.divider} />
									<Text style={[
										styles.text,
										activeChapter === chapterNo && styles.activeText,
										{ flex: 1 }]}
									>
										{`${item}`}
									</Text>
								</View>

								<Icon name="next" color={ss.constants.COLOR_TINT_LIGHT} size={ss.size(14)} />
							</TouchableOpacity>
						)
					}}
				/>
			</View>
		</Modal>
	)
}

WorkbookChaptersModal.propTypes = {
	showChapters: PropTypes.bool.isRequired,
	toggleShowChapters: PropTypes.func.isRequired,
	onPress: PropTypes.func.isRequired,
	chapters: PropTypes.arrayOf(PropTypes.string).isRequired,
	activeChapter: PropTypes.number.isRequired,
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { p, pSemiBold, pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: '#f9f9f9',
		// backgroundColor: 'gray', // NOTE testing flexbox
		android: {
			paddingTop: ss.constants.HEIGHT_NAV_BAR - ss.constants.HEIGHT_STATUS_BAR,
		},
	},
	navbar: {
		borderBottomWidth: 1,
		android: {
			top: -ss.constants.HEIGHT_STATUS_BAR,
		},
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		padding: size(20),
	},
	icon: {
		marginRight: size(10),
	},
	numberOfChapters: {
		...pLight,
		fontSize: size(18),
		paddingBottom: 2,
	},
	row: {
		alignItems: 'center',
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: size(20),
	},
	separator: {
		height: 1,
		backgroundColor: ss.constants.COLOR_CORE_PRIMARY,
		opacity: 0.1,
	},
	chapter: {
		flex: 1,
		flexDirection: 'row',
		paddingRight: ss.size(10),
	},
	text: {
		...p,
		color: ss.constants.COLOR_HEADING,
		justifyContent: 'center',
	},
	activeText: {
		...pSemiBold,
		color: ss.constants.COLOR_HEADING,
		justifyContent: 'center',
	},
	divider: {
		width: 1,
		backgroundColor: ss.constants.COLOR_CORE_PRIMARY,
		marginRight: ss.size(20)
	},
})


export default WorkbookChaptersModal
