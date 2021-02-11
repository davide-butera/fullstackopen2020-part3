/* eslint-disable react/prop-types */
import React from 'react'

const Person = ({ name, number, deleteName }) => (
  <li>
    {name}
    {' '}
    {number}
    {' '}
    <button type="button" onClick={deleteName}>delete</button>
  </li>
)

export default Person
