import React, { Component } from 'react'
import {
	View,
	ScrollView,
	Dimensions,
	findNodeHandle,
} from 'react-native'

import AddPaging from 'react-native-paged-scroll-view/index'

import common from '../../../common'

import ActivityFormField from './activity-form-field'
import ActivityHeader from './activity-header'
import ActivityPagination from './activity-pagination'
import ActivityButtons from './activity-buttons'
import ActivityImage from './activity-image'

import ss from '../../../styles'

const PagedScrollView = AddPaging(ScrollView)

const { Form } = common.components.form
const SWIPER_WIDTH = Dimensions.get('window').width

class MultipleTextActivity extends Component {
	state = {
		currentPage: 1,
		totalPages: null,
		activeHandle: null,
	}

	componentWillReceiveProps(nextProps) {
		const { activeField } = nextProps

		// set active field handle for scroll
		if (this.props.activeField !== activeField) {
			const handle = findNodeHandle(this.refs[activeField])
			this.setState({ activeHandle: handle })
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

	render() {
		const {
			activity,
			canModify,
			canSubmit,
			saving,
			onSave,
			submitting,
			onSubmit,
		} = this.props
		const { currentPage, totalPages, activeHandle } = this.state

		return (
			<Form
				// ref={ref => this.form = ref}
				style={styles.container}
				behaviour="scroll"
				activeHandle={activeHandle}
			>
				<ActivityHeader activity={activity} />
				<ActivityImage />
				<PagedScrollView
					ref={(c) => { this.list = c }}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onPageChange={this.handlePageChange}
					onInitialization={({ props: { children } }) => this.setTotalPagesCount(children.length)}
					style={styles.container}
				>
					{activity.content.prompts.map((prompt, i) => (
						<View ref={`input${i}`} key={`input${i}`} style={styles.contentContainer}>
							<ActivityFormField
								index={i}
								label={prompt.title}
								placeholder={prompt.title}
								editable={canModify || !saving || !submitting}
							/>
						</View>
					))}
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
		marginBottom: 5,
	},
	paginationContainer: {
		paddingTop: size(15),
	},
	buttonsContainer: {
		paddingHorizontal: size(15),
	},
})

export default MultipleTextActivity
