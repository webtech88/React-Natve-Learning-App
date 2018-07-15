import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ListView,
	View,
} from 'react-native'

import IqaWorkbookListItem from './iqa-workbook-list-item'

import ss from '../../styles'


class IqaWorkbookListView extends Component {

	constructor(props) {
		super(props)

		this.state = {
			workbooks: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
		}
	}

	componentDidMount() {
		if (this.props.workbooks.length) {
			this.setState({
				workbooks: this.state.workbooks.cloneWithRows(this.props.workbooks),
			})
		}
	}

	componentWillReceiveProps(newProps) {
		if (this.props.workbooks !== newProps.workbooks) {
			this.setState({
				workbooks: this.state.workbooks.cloneWithRows(newProps.workbooks),
			})

			this.workbooksList.scrollTo({ x: 0, y: 0, animated: false })
		}
	}

	render() {
		const { style, onPress, ...otherProps } = this.props

		return (
			<ListView
				ref={(ref) => { this.workbooksList = ref }}
				style={style}
				dataSource={this.state.workbooks}
				renderRow={(item, sectionID, rowID) => (
					<View style={{ flex: 1, overflow: 'hidden' }} key={`Workbook_${item.workbook_id}`}>
						{(rowID > 0) && <View style={styles.separator} />}
						<IqaWorkbookListItem key={`Workbook_${item.workbook_id}`} workbook={item} onPress={onPress} />
					</View>
				)}
				{...otherProps}
			/>
		)
	}

}

IqaWorkbookListView.propTypes = {
	workbooks: PropTypes.array.isRequired,
	onPress: PropTypes.func.isRequired,
}


// StyleSheet
const styles = ss.create({
	separator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
})


export default IqaWorkbookListView
