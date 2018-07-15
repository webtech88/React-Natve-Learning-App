import React, { Component } from 'react'
import {
	ScrollView,
	RefreshControl,
	View,
	Text,
	TouchableOpacity,
	Linking,
	Alert,
	Animated,
} from 'react-native'

import PropTypes from 'prop-types'

import R, { find, propEq } from 'ramda'
import redraft from 'redraft'

import ss from '../../../styles'
import common from '../../../common'

const { TransText, Icon } = common.components.core

// Draft.js content blocks
import Unstyled from './draft/unstyled'
import Blockquote from './draft/blockquote'
import HeaderOne from './draft/header-one'
import HeaderTwo from './draft/header-two'
import HeaderThree from './draft/header-three'
import List from './draft/list'
import ImageBlock from './draft/image-block'
import VideoBlock from './draft/video-block'
import ActivityBlock from './draft/activity-block'
import LinkBlock from './draft/link-block'

import WorkbookHeader from './workbook-header'
import WorkbookChaptersModal from './workbook-chapters-modal'

import { getChapterTitles } from '../../util/helpers'

const HEIGHT = ss.constants.HEIGHT_DEVICE
const HEIGHT_NAV_BAR = ss.constants.HEIGHT_NAV_BAR
const HEIGHT_MINUS_NAV_BAR = HEIGHT - HEIGHT_NAV_BAR

class WorkbookRenderer extends Component {

	state = {
		refreshing: false,
		chapter: this.props.chapter,
		scrollY: new Animated.Value(0),
		chaptersNavOffset: new Animated.Value(0),
		// isAnimating: false,
	}

	// componentWillMount() {
	// 	this.state.scrollY.addListener((e) => {
	// 		// const {  } = this.state
	// 		console.log(e.value)
	// 		// TODO
	// 		// pan responder to detect scrolling up or down ???
	// 	})
	// }

	componentWillReceiveProps(nextProps) {
		if (this.props.workbook !== nextProps.workbook) {
			// TODO setting chapter to 0 because on refresh state chapter could be higher than total
			this.setState({ refreshing: false, chapter: 0 })
			this.props.onChapterChange(0)
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.chapter !== this.state.chapter) {
			setTimeout(() => {
				this.workbookContent.scrollTo({ x: 0, y: 0, animated: false })
			})
		}
	}

	onRefresh = () => {
		this.setState({ refreshing: true })
		this.props.onRefresh()
	}

	setChapter: void = (value: number) => {
		const { onChapterChange, toggleShowChapters } = this.props
		this.setState({ chapter: value })
		onChapterChange(value)
		toggleShowChapters()
	}

	changeChapter = (value) => {
		const { chapter } = this.state
		const nextChapter = value > 0 ? chapter + value : chapter - 1

		this.setState({ chapter: nextChapter }, () => this.props.onChapterChange(nextChapter))
	}

	findActivity = (data) => {
		const { activities } = this.props
		return activities && find(propEq('activity_code', data.activity_code))(activities)
	}

	splitContentToChapters = (content) => {
		let start
		const chapters = []

		content.map((element, key) => {
			if (
				Array.isArray(element) &&
				element.length > 0 &&
				element[0] !== null &&
				element[0].key && R.contains('Chapter_', element[0].key)
			) {
				if (typeof start === 'undefined') {
					start = key
				} else {
					chapters.push(content.slice(start, key))
					start = key
				}
			}
		})

		chapters.push(content.slice(start, content.length))

		return chapters
	}

	handleLinkBlockPress = (url) => {
		const link = (url.indexOf('://') === -1) ? `http://${url.trim()}` : url.trim()

		Linking.canOpenURL(link).then((supported) => {
			if (supported) {
				Linking.openURL(link)
			} else {
				Alert.alert(
					'Invalid link.',
					'Sorry we could not open this link.',
				)
			}
		})
	}

	handleScroll = (event) => {
		const { scrollY, chaptersNavOffset } = this.state

		// CHAPTERS NAV ANIMATION
		if (scrollY < event.nativeEvent.contentOffset.y &&
			event.nativeEvent.contentOffset.y >= ss.size(60) &&
			event.nativeEvent.contentOffset.y + HEIGHT_MINUS_NAV_BAR < event.nativeEvent.contentSize.height
		) {
			// after scrolling down more than 60px (and not at bottom of scrollview)
			Animated.timing(
				this.state.chaptersNavOffset,
				{
					toValue: ss.size(60),
					useNativeDriver: true,
				},
			).start()
		} else if (chaptersNavOffset._value > 0) {
			// scrolling back up or if at end of scrollview
			Animated.timing(
				this.state.chaptersNavOffset,
				{
					toValue: 0,
					useNativeDriver: true,
				},
			).start()
		}

		this.setState({ scrollY: event.nativeEvent.contentOffset.y })
	}

	render() {
		const { workbook, activities, showOnly, showChapters, toggleShowChapters, onOpenActivity } = this.props
		// const { scrollY } = this.state

		const renderers = {
			inline: {
				BOLD: (children, { key }) =>
					<Text key={`Bold_${key}`} selectable style={{ fontWeight: 'bold' }}>{children}</Text>,
				ITALIC: (children, { key }) =>
					<Text key={`Italic_${key}`} selectable style={{ fontStyle: 'italic' }}>{children}</Text>,
				highlight: (children, { key }) =>
					<Text key={`Highlight_${key}`} selectable style={{ backgroundColor: 'yellow' }}>{children}</Text>,
			},
			blocks: {
				unstyled: children => children.map(child =>
					<Unstyled style={styles.margin}>{child}</Unstyled>),
				'header-one': children => children.map((child, index) =>
					<HeaderOne key={`Chapter_${index}`} style={styles.margin}>{child}</HeaderOne>),
				'header-two': children => children.map(child =>
					<HeaderTwo style={styles.margin}>{child}</HeaderTwo>),
				'header-three': children => children.map(child =>
					<HeaderThree style={styles.margin}>{child}</HeaderThree>),
				'header-four': children => children.map(() => null), // NOTE not needed
				'header-five': children => children.map(() => null), // NOTE not needed
				'header-six': children => children.map(() => null), // NOTE not needed
				blockquote: children => children.map(child =>
					<Blockquote style={styles.margin}>{child}</Blockquote>),
				'code-block': children => children.map(() => null), // NOTE not needed
				atomic: children => children.map(child => child[1] || null), // NOTE be careful...
				'unordered-list-item': (children, { depth, keys }) =>
					(<List
						key={`List_${keys[keys.length - 1]}`}
						style={styles.margin}
						depth={depth}
						items={children}
					/>),
				'ordered-list-item': (children, { depth, keys }) =>
					(<List
						key={`List_${keys[keys.length - 1]}`}
						style={styles.margin}
						type="ordered"
						depth={depth}
						items={children}
					/>),
			},
			entities: {
				// TODO
				IMAGE: (children, data, { key }) => children.map(() =>
					// <ImageBlock key={`Image_${key}`} data={data} scrollY={this.state.scrollY} />,
					<ImageBlock key={`Image_${key}`} data={data} />,
				),
				VIDEO: (children, data, { key }) => children.map(() =>
					<VideoBlock key={`Video_${key}`} data={data} />,
				),
				ACTIVITY: (children, data, { key }) => children.map(() => {
					const activity = this.findActivity(data)

					if (activity) {
						return (
							<ActivityBlock
								key={`Activity_${key}`}
								style={styles.margin}
								data={activity}
								onPress={() => onOpenActivity(activity.activity_id, activity.activity_code)}
							/>
						)
					}

					return null
				}),
				LINKBLOCK: (children, data, { key }) => children.map(() =>
					data && data.url
					? <LinkBlock
						key={`LinkBlock_${key}`}
						data={data}
						onPress={() => this.handleLinkBlockPress(data.url)}
						style={styles.margin}
					/>
					: null,
				),
				LINK: (children, data, { key }) => children.map(() =>
					data && data.url
					? <Text
						key={`Link_${key}`}
						style={styles.margin}
						onPress={() => this.handleLinkBlockPress(data.url)}
					>
						{data.url}
					</Text>
					: null,
				),
			},
		}

		if (workbook) {
			let rendered = null
			let chapters = []

			if (workbook.content) {
				// TODO Optionaly filter content type with state
				const filterContentFn = showOnly
				? R.filter(R.pipe(R.prop('type'), R.contains(R.__, showOnly)))
				: R.identity

				const cleanEmptyShowOnly = (x) => {
					if (showOnly) {
						const blocks = R.filter((block) => {
							const key = block.entityRanges[0].key
							const entityKeys = R.pipe(R.prop('entityMap'), R.keys, R.map(Number))(x)
							return R.contains(Number(key), entityKeys)
						}, x.blocks)
						return R.merge(x, { blocks })
					}
					return x
				}

				rendered = R.pipe(
					JSON.parse,
					R.map(filterContentFn),
					cleanEmptyShowOnly,
					x => redraft(x, renderers, { cleanup: false }),
				)(workbook.content)

				chapters = showOnly ? R.of(rendered) : this.splitContentToChapters(rendered)
			}

			const totalActivities = activities.length
			const completedActivities = activities.filter(
				activity => R.contains(
					activity.status,
					['submitted', 'approved'],
			)).length

			const remainingChapters = Math.max(0, (chapters.length - this.state.chapter - 1))
			const hasPrevChapter = this.state.chapter > 0
			const hasNextChapter = !!remainingChapters

			// const chaptersNavPosition = scrollY.interpolate({
			// 	inputRange: [ss.size(60), ss.size(120), scrollViewHeight - (HEIGHT - HEIGHT_NAV_BAR) - ss.size(60), scrollViewHeight - (HEIGHT - HEIGHT_NAV_BAR)],
			// 	outputRange: [0, -ss.size(60), -ss.size(60), 0],
			// 	extrapolate: 'clamp',
			// })

			return (
				<View style={styles.workbook}>
					<ScrollView
						ref={(c) => { this.workbookContent = c }}
						style={styles.scroll}
						contentContainerStyle={styles.scrollContainer}
						directionalLockEnabled
						scrollEventThrottle={16}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
						)}
						// onScroll={e => this.handleScroll(e)}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh}
							/>
						}
					>
						<WorkbookHeader
							workbook={workbook}
							totalActivities={totalActivities}
							completedActivities={completedActivities}
						/>
						<View style={styles.chapter}>
							{
								(chapters && chapters.length)
								? R.nth(showOnly ? 0 : this.state.chapter, chapters)
								: <Text style={styles.empty}>No content</Text>
							}
						</View>
					</ScrollView>
					{/* <Animated.View style={[styles.chaptersNav, { transform: [{translateY: this.state.chaptersNavOffset }] }]}> */}
					<Animated.View style={[styles.chaptersNav]}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => hasPrevChapter ? this.changeChapter(-1) : null}
						>
							<View style={[styles.chaptersTouchable, { opacity: hasPrevChapter ? 1 : 0.3 }]}>
								<View style={[styles.prevNextContainer, { marginRight: ss.size(10), paddingRight: 2 }]}>
									<Icon name="back" color={ss.constants.COLOR_CORE_BRAND} size={ss.size(12)} />
								</View>
								<TransText style={styles.chaptersLink} transkey="PREVIOUS" />
							</View>
						</TouchableOpacity>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TransText 
								style={styles.chaptersLeft}
								transkeys={[remainingChapters, remainingChapters < 2 ? 'chapter' : 'chapters', ' ', 'left']}
								tindices={[1, 3]}
							/>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => hasNextChapter ? this.changeChapter(1) : null}
							>
								<View style={[styles.chaptersTouchable, { opacity: hasNextChapter ? 1 : 0.3 }]}>
									<TransText style={styles.chaptersLink} transkey="NEXT" />
									<View style={[styles.prevNextContainer, { marginLeft: ss.size(10), paddingLeft: 1 }]}>
										<Icon name="next" color={ss.constants.COLOR_CORE_BRAND} size={ss.size(12)} />
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</Animated.View>
					<WorkbookChaptersModal
						showChapters={showChapters}
						toggleShowChapters={toggleShowChapters}
						onPress={this.setChapter}
						chapters={getChapterTitles(chapters)}
						activeChapter={this.state.chapter + 1}
					/>
				</View>
			)
		}

		return null
	}
}

WorkbookRenderer.propTypes = {
	workbook: PropTypes.object.isRequired,
	activities: PropTypes.array.isRequired,
	chapter: PropTypes.number,
	showOnly: PropTypes.array,
	showChapters: PropTypes.bool.isRequired,
	onChapterChange: PropTypes.func.isRequired,
	onRefresh: PropTypes.func.isRequired,
	onOpenActivity: PropTypes.func.isRequired,
	toggleShowChapters: PropTypes.func,
}

WorkbookRenderer.defaultProps = {
	chapter: 0,
	showOnly: null,
	toggleShowChapters: () => ({}),
}

// StyleSheet
const {
	size,
	typo: { p, link },
} = ss

const styles = ss.create({
	workbook: {
		backgroundColor: 'white',
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
		// paddingBottom: size(40),
	},
	scroll: {
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	scrollContainer: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingBottom: size(40),
	},
	chapter: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingVertical: size(20),
	},
	empty: {
		...p,
		textAlign: 'center',
		marginVertical: size(50),
	},
	margin: {
		marginHorizontal: size(20),
	},
	chaptersNav: {
		zIndex: 2,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: size(60),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: size(20),
		borderTopWidth: 1,
		borderTopColor: ss.constants.COLOR_TINT_LIGHTER,
		backgroundColor: 'white',
	},
	chaptersTouchable: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	prevNextContainer: {
		height: size(30),
		width: size(30),
		borderRadius: size(30),
		borderColor: ss.constants.COLOR_CORE_BRAND,
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	chaptersLink: {
		...link,
		fontSize: size(12),
	},
	chaptersLeft: {
		...p,
		fontSize: size(12),
		opacity: 0.5,
		marginRight: size(15),
	},
})

export default WorkbookRenderer
