import React, { Component } from 'react'
import {
	View,
	TextInput,
	TouchableOpacity,
} from 'react-native'

import FloatingLabel from './label-floating'
import MediaTag from '../profile/tag'
import Icon from '../core/icon'

import ss from '../../../styles'

const HEIGHT_INPUT = ss.size(42)
const SEPARATORS = [',', ';', '\n']

class TagField extends Component {
	state = {
		inputHeight: HEIGHT_INPUT,
		value: '',
		tags: (this.props.input.value && this.props.input.value.asMutable()) || [],
		suggestedTags: [],
	}

	onChangeText = (text) => {
		this.setState({ value: text })

		const lastTyped = text.charAt(text.length - 1)

		if (SEPARATORS.indexOf(lastTyped) > -1) {
			this.parseTags()
		}
	}

	parseTags = () => {
		const { value } = this.state
		const { tags } = this.state

		if (tags.indexOf(value.trim()) === -1) {
			tags.push(value)
			this.setState({
				tags,
			}, () => this.props.input.onChange(tags))
		}

		this.setState({ value: '' })
	}

	selectSuggestedTag = (tag) => {
		const { tags, suggestedTags } = this.state
		const index = suggestedTags.indexOf(tag)
		const newTags = tags.concat(tag)
		this.setState({
			tags: newTags,
			suggestedTags: suggestedTags.filter((_, i) => i !== index),
		}, () => this.props.input.onChange(newTags))
	}

	deleteTag = (tag) => {
		const { tags } = this.state
		const index = tags.indexOf(tag)
		const newTags = tags.filter((_, i) => i !== index)
		this.setState({
			tags: newTags,
		}, () => this.props.input.onChange(newTags))
	}

	renderTag = (tag, index, suggested) => (
		<MediaTag
			tag={tag}
			suggested={suggested}
			onPress={this.selectSuggestedTag}
			onDeletePress={this.deleteTag}
			editable
			key={`${suggested && 'suggested_'}tag_${index}`}
		/>
	)

	render() {
		const {
			input: { name, onFocus, onBlur },
			meta: { active, error, touched, valid },
			label, required, initialValue, disabled, ...otherProps
		} = this.props
		const labelError = (!active && error && touched && !valid) ? error : ''
		const { tags, suggestedTags, value } = this.state

		return (
			<View ref={`Field_${name}`} style={[styles.container, (disabled && { opacity: 0.3 })]}>
				<View style={[styles.field, (active && styles.active)]}>
					<FloatingLabel label={label} value={this.state.value} required={required} error={labelError} />
					<TextInput
						ref={name}
						style={[
							styles.input,
							(labelError && styles.error),
						]}
						underlineColorAndroid="transparent" // NOTE Android only
						onChangeText={text => this.onChangeText(text)}
						onKeyPress={this.onKeyPress}
						onFocus={onFocus}
						onBlur={onBlur}
						value={value.toString()}
						keyboardAppearance="dark" // NOTE iOS only
						{...otherProps}
					/>
					<TouchableOpacity
						style={styles.addTag}
						onPress={this.state.value.length > 0 ? this.parseTags : onFocus} // TODO: not working
						activeOpacity={0.9}
					>
						<View style={styles.icon}>
							<Icon name="add" color="white" size={ss.size(14)} />
						</View>
					</TouchableOpacity>
				</View>
				{/* Tag container—to include both chosen and suggested tags */}
				{/*  TODO: Fix bug when deleting tabs at point when tabs should fill one line for the first time */}
				<View style={styles.tagContainer}>
					{tags && tags.length > 0 &&
						tags.map((tag, index) => this.renderTag(tag, index))
					}
					{suggestedTags && suggestedTags.length > 0 &&
						suggestedTags.map((suggestedTag, index) => this.renderTag(suggestedTag, index, 'suggested'))
					}
				</View>
			</View>
		)
	}
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	container: {
		marginBottom: size(15),
	},
	field: {
		position: 'relative',
		borderColor: ss.constants.COLOR_CORE_PRIMARY,
		paddingBottom: 1,
		borderBottomWidth: 1,
		paddingTop: size(10),
	},
	input: {
		...p,
		height: HEIGHT_INPUT,
		paddingTop: 5,
		paddingBottom: 5,
		paddingHorizontal: 0, // NOTE Android only
		backgroundColor: 'transparent',
	},
	active: {
		paddingBottom: 0,
		borderBottomWidth: 2,
	},
	error: {
		color: ss.constants.COLOR_ACCENT_RED,
		opacity: 1,
	},
	tagContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingVertical: size(10),
	},
	addTag: {
		justifyContent: 'center',
		paddingTop: size(10),
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
	},
	icon: {
		backgroundColor: ss.constants.COLOR_SUPPORTING_SECONDARY,
		height: size(25),
		width: size(25),
		borderRadius: size(25),
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default TagField
