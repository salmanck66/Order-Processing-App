import React from 'react'
import { Link } from 'react-router-dom'
const Title = ({name}) => {
  return (
    <>
    <Link to={'/reseller'} className='text-white'>
    <h1>JC Club</h1>
    </Link>
    </>
  )
}

export default Title