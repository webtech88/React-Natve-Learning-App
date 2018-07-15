import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { View, Image, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import Icon from './icon'

import lang from '../../../core/config/lang'

const { locales, getText } = lang

class TransTouchable extends Component {
	render() {
		const {
      textstyle,
      textstring,
      titlestyle,
      titlestring,
      iconname,
      iconcolor,
      iconsize,
      viewstyle,
      locale,
      ...otherProps
    } = this.props

		return (
        titlestring ?
        <TouchableHighlight
          {...otherProps}
        >
          <View style={viewstyle}>
            <Text style={titlestyle} numberOfLines={1}>{getText(titlestring, locale)}</Text>
            {textstring &&
              <Text style={textstyle} numberOfLines={1}>{getText(textstring, locale)}</Text>
            }
            { iconname &&
              <Icon name={iconname} color={iconcolor} size={iconsize} />
            }
          </View>
        </TouchableHighlight> :
        <TouchableHighlight
          {...otherProps}
        >
          <Text style={textstyle}>{getText(textstring, locale)}</Text>
        </TouchableHighlight>)
  }
}

TransTouchable.propTypes = {
	textstring: PropTypes.string,
	titlestyle: PropTypes.object,
	titlestring: PropTypes.string,
	locale: PropTypes.string,
	iconcolor: PropTypes.object,
	viewstyle: PropTypes.object,
	iconsize: PropTypes.string,
	otherProps: PropTypes.object,
}

const mapStateToProps = state => ({
	locale: state.app.locale,
})

export default connect(mapStateToProps, null)(TransTouchable)
