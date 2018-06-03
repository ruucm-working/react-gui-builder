import React from 'react'
import { Link } from 'react-router'

const RouterLink = props => {
  return <Link {...props}>{props.children}</Link>
}

export default RouterLink
