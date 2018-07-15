import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

import lang from '../../../core/config/lang'

const { locales, getText } = lang

class TransText extends Component {
  render() {
    const { transkey, locale, innertop, innerbottom, transkeys, tindices, ...otherProps} = this.props
    let text = ''

    if (transkeys) {
      const translatableIndices = tindices || []
      transkeys.forEach((v, k) => text += translatableIndices.indexOf(k) !== -1 ? getText(v, locale) : v)
    } else {
      text = getText(transkey, locale)
    }
    
    return (
      <Text {...otherProps}>
        {innertop || ''}
        {text}
        {innerbottom || ''}
      </Text>
    )
  }
}

TransText.propTypes = {
	locale: PropTypes.string,
  innertop: PropTypes.element,
  innerbottom: PropTypes.element,
  transkeys: PropTypes.array,
  tindices: PropTypes.array,
  otherProps: PropTypes.object,
}

const mapStateToProps = state => ({
	locale: state.app.locale
})

export default connect(mapStateToProps, null)(TransText)