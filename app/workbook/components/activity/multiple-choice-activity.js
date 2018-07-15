import React, { Component } from 'react'
import {
	View,
	ScrollView,
} from 'react-native'

import R from 'ramda'
import AddPaging from 'react-native-paged-scroll-view/index'
import { Field } from 'redux-form'

import common from '../../../common'

import ActivityHeader from './activity-header'
import ActivityPagination from './activity-pagination'
import ActivityButtons from './activity-buttons'
import ActivityDescription from './activity-description'
import ActivityImage from './activity-image'

import ss from '../../../styles'

const PagedScrollView = AddPaging(ScrollView)

const { Form, RadioField } = common.components.form
const { shuffle } = common.util.helpers
const SWIPER_WIDTH = ss.constants.WIDTH_DEVICE
const shuffledOptions = R.pipe(R.toPairs, shuffle, R.fromPairs)

class MultipleChoiceActivity extends Component {

	constructor(props) {
		super(props)

		let prompts = this.props.activity.content.prompts

		if (__DEV__) {
			prompts = prompts.map(prompt => ({
				...prompt,
				answer: `${prompt.answer} (CORRECT ANSWER)`,
			}))
		}

		this.state = {
			currentPage: 1,
			totalPages: null,
			prompts: prompts.map(prompt => shuffledOptions(prompt.without('question'))),
		}
	}

	setTotalPagesCount = count => this.setState({ totalPages: count })

	handlePageChange = state => this.setState({ currentPage: state.currentHorizontalPage })

	scroll = (forward = true, animated = true) => {
		const { currentPage } = this.state
		const multiplier = forward ? currentPage : currentPage - 2

		this.list._scrollView.scrollTo({ x: multiplier * SWIPER_WIDTH, y: 0, animated })
	}

	scrollToLastPage = (animated = true) => this.list._scrollView.scrollToEnd({ animated })

	renderField = (question, key) => {
		const { canModify, saving, submitting } = this.props
		const label = question.question
		const options = this.state.prompts[key]

		return (
			<View key={key} style={styles.contentContainer}>
				<Field
					ref={`input${key}`}
					withRef
					name={`input${key}`}
					label={label}
					labelColor={ss.constants.COLOR_HEADING}
					options={options}
					component={RadioField}
					editable={canModify || !saving || !submitting}
				/>
			</View>
		)
	}

	render() {
		const {
			activity,
			canSubmit,
			saving,
			onSave,
			submitting,
			onSubmit,
		 } = this.props
		const { currentPage, totalPages } = this.state
		const content = activity.content

		return (
			<Form
				style={styles.container}
				behaviour="scroll"
			>
				<ActivityHeader activity={activity} />
				<ActivityImage />
				<ActivityDescription description={content.activityText} style={styles.description} />
				<PagedScrollView
					ref={(c) => { this.list = c }}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onPageChange={this.handlePageChange}
					onInitialization={({ props: { children } }) => this.setTotalPagesCount(children.length)}
					style={styles.container}
				>
					{content.prompts.map((prompt, i) => this.renderField(prompt, i))}
				</PagedScrollView>
				{totalPages && (
					<View style={styles.paginationContainer} >
						<ActivityPagination
							currentPage={currentPage}
							totalPages={totalPages}
							onScrollForward={() => this.scroll(true)}
							onScrollBackwards={() => this.scroll(false)}
							onScrollToEnd={this.scrollToLastPage}
						/>
					</View>
				)}
				<View style={styles.buttonsContainer}>
					<ActivityButtons
						canSubmit={canSubmit}
						saving={saving}
						onSavePress={onSave}
						submitting={submitting}
						onSubmitPress={onSubmit}
					/>
				</View>
			</Form>
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
	contentContainer: {
		paddingHorizontal: size(15),
		width: SWIPER_WIDTH,
		flex: 1,
	},
	paginationContainer: {
		paddingTop: size(15),
	},
	buttonsContainer: {
		paddingHorizontal: size(15),
	},
	description: {
		paddingTop: size(22),
		paddingHorizontal: size(15),
	},
})

export default MultipleChoiceActivity
