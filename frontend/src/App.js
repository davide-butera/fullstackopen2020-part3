/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    if (persons.find((person) => person.name === newName) !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find((x) => x.name === newName)
            
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            if (returnedPerson.error) {
              setErrorMessage(returnedPerson.error)
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            }
            else {
              setPersons(persons.map(person => {
                if(person.name === returnedPerson.name) {
                  person.number = returnedPerson.number
                  return person
                }
                else {
                  return person
                }
              }))
              setNewName('')
              setNewNumber('')
              setSuccessMessage(`Updated '${newName}'`)
              setTimeout(() => { setSuccessMessage(null) }, 5000)
            }
          }) 
      }
    } else {
      const noteObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(noteObject)
        .then(returnedPerson => {
          if (returnedPerson.error) {
            setErrorMessage(returnedPerson.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          }
          else {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`Added '${newName}'`)
            setTimeout(() => { setSuccessMessage(null) }, 5000)
          }
        })
    }
  }

  const deleteName = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deleteName(person.id).catch(() => {
        setErrorMessage(
          `Information of '${person.name}' was already removed from server`,
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      setPersons(persons.filter((n) => n.id !== person.id))
    }
  }

  // eslint-disable-next-line no-shadow
  const contactsToShow = search === ''
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))

  const searchName = (event) => {
    setSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      <Filter {...{ search, searchName, addName }} />
      <h2>add a new</h2>

      <PersonForm
        {...{
          newName,
          handleNameChange,
          newNumber,
          handleNumberChange,
          addName,
        }}
      />
      <Persons {...{ contactsToShow, deleteName }} />
    </div>
  )
}

export default App
