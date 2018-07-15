import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	LayoutAnimation,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	Platform,
} from 'react-native'

import common from '../../common'

import ss from '../../styles'

const {
	size,
	typo: { h1, p },
} = ss

const { ProgressBadge, LevelBadge } = common.components.workbook
const { TextFadeSvg } = common.components.svg
const { Button, IconToggle, DraftRenderer, DropShadow, TransText } = common.components.core

const PROGRESS_DIMENSIONS = size(75)

const LayoutSpringAnim = {
	duration: 350,
	// duration: 2000,
	create: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
	update: {
		type: LayoutAnimation.Types.spring,
		property: LayoutAnimation.Properties.opacity,
		springDamping: 1.4,
	},
	delete: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
}


class QualificationCard extends Component {

	state = {
		toggled: false,
	}

	componentDidMount() {
		if (this.props.toggled) {
			this.setState({ toggled: true })
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state.toggled !== nextState.toggled && !nextState.toggled) {
			this.qualificationInfoScroll.scrollTo({ x: 0, y: 0, animated: false })
		}
	}

	toggleQualification = () => {
		LayoutAnimation.configureNext(LayoutSpringAnim)
		this.setState({ toggled: !this.state.toggled })
	}

	handlePress = () => {
		this.toggleQualification()
		this.props.onPress()
	}

	render() {
		const { qualification } = this.props
		const { toggled } = this.state

		return (
			<View style={styles.container}>
				<View style={[styles.card, { flex: toggled ? 1 : 0 }]}>
					<View style={[styles.info, { flex: toggled ? 1 : 0 }]}>
						<TextFadeSvg position="top" />
						<TouchableOpacity
							style={styles.iconToggle}
							activeOpacity={1}
							onPress={this.toggleQualification}
						>
							<IconToggle expanded={toggled} />
						</TouchableOpacity>
						<ScrollView
							style={styles.scroll}
							ref={(c) => { this.qualificationInfoScroll = c }}
							contentContainerStyle={styles.scrollContainer}
							directionalLockEnabled
						>
							<TouchableOpacity
								activeOpacity={1}
								onPress={this.toggleQualification}
							>
								<Text numberOfLines={toggled ? 0 : 2} style={styles.h1}>
									{qualification.short_title}
								</Text>
								<TransText 
									numberOfLines={1}
									style={styles.pSmall}
									transkeys={['UNITS_COMPLETED', ': ', qualification.units_complete]}
									tindices={[0]}
								/>
								<TransText
									numberOfLines={1}
									style={[styles.pSmall, { marginBottom: size(10), color: ss.constants.COLOR_LINK }]}
									transkeys={['CREDITS_EARNED', ': ', qualification.credits_earned]}
									tindices={[0]}
								/>
								{toggled && qualification.overview && (
									<View style={{ paddingVertical: size(15) }}>
										<DraftRenderer content={qualification.overview} />
									</View>
								)}
							</TouchableOpacity>
						</ScrollView>
						<TextFadeSvg style={{ marginBottom: -size(10) }} />
						{toggled && (
							<Button
								style={styles.button}
								label="Go to Workbooks"
								disabled={qualification.gettingWorkbooks}
								isLoading={qualification.gettingWorkbooks}
								onPress={this.handlePress}
							/>
						)}
					</View>
					<View style={styles.progress}>
						<ProgressBadge
							style={{ marginRight: size(15) }}
							dimensions={PROGRESS_DIMENSIONS}
							percentage={qualification.progress_percentage}
							animated
						/>
						<LevelBadge level={qualification.level} />
					</View>
				</View>
				{Platform.OS === 'ios' && <DropShadow width={ss.constants.WIDTH_DEVICE - size(120)} />}
			</View>
		)
	}

}

QualificationCard.propTypes = {
	toggled: PropTypes.bool.isRequired,
	qualification: PropTypes.object.isRequired,
	onPress: PropTypes.func.isRequired,
}

QualificationCard.defaultProps = {
	toggled: false,
}


// StyleSheet
const styles = ss.create({
	container: {
		// backgroundColor: 'rgba(0, 0, 0, .1)', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'flex-end',
		paddingTop: size(40),
		marginBottom: size(40),
		marginHorizontal: size(40),
	},
	card: {
		// backgroundColor: 'rgba(0, 0, 0, .1)', // NOTE testing flexbox
		flex: 0,
		overflow: 'hidden',
	},
	progress: {
		// backgroundColor: 'red', // NOTE testing flexbox
		position: 'absolute',
		top: (PROGRESS_DIMENSIONS / 2),
		right: size(35),
		left: 0,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: size(20),
	},
	info: {
		backgroundColor: 'white',
		// backgroundColor: 'red', // NOTE testing flexbox
		marginTop: PROGRESS_DIMENSIONS,
		paddingTop: (PROGRESS_DIMENSIONS / 4),
	},
	iconToggle: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 1,
		padding: size(10),
	},
	scroll: {
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	scrollContainer: {
		// backgroundColor: 'gray', // NOTE testing flexbox
		paddingTop: (PROGRESS_DIMENSIONS / 4),
		paddingBottom: size(20),
		paddingHorizontal: size(20),
	},
	h1: {
		...h1,
		marginVertical: size(10),
		backgroundColor: 'transparent',
	},
	pSmall: {
		...p,
		fontSize: size(12),
		backgroundColor: 'transparent',
	},
	button: {
		zIndex: 1,
		marginHorizontal: size(20),
		marginBottom: size(20),
	},
})

export default QualificationCard
