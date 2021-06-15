import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import ToggleButton from 'Components/ToggleButton'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'

import { Column, Container, Post, PostAuthor, PostBody } from './styles'

import ExpensiveTree from '../ExpensiveTree'

const AVAILABLE_LIMITS = [5, 10, 20]

function Root() {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(AVAILABLE_LIMITS[0])
  const [fields, setFields] = useState([
    {
      name: faker.name.findName(),
      id: nanoid(),
      inputValue: '',
    },
  ])

  const [value, setValue] = useState('')
  const { data, loading } = useQuery(postsQuery, { variables: { page, limit } })

  function handlePush() {
    setFields([
      ...fields,
      { name: faker.name.findName(), id: nanoid(), inputValue: '' },
    ])
  }

  function handleFormInput(inputValue, id) {
    setFields(ps => ps.map(f => (f.id === id ? { ...f, inputValue } : f)))
  }

  function handleAlertClick() {
    setTimeout(() => {
      alert(`You clicked ${count} times`)
    }, 2500)
  }

  function handleLimitSelect(selectedLimit) {
    setLimit(selectedLimit)
    setPage(1)
  }

  function handlePageSelect(seletedPage) {
    setPage(seletedPage)
  }

  const posts = data?.posts.data || []

  const totalPosts = data?.posts?.meta?.totalCount
  const totalPages = totalPosts / limit
  const pageNos = Array.from({ length: totalPages }, (v, i) => i + 1)

  return (
    <Container>
      <Column>
        <h4>Need to add pagination</h4>
        {loading
          ? 'Loading...'
          : posts.map(post => (
              <Post key={post.id} mx={4}>
                <NavLink href={POST(post.id)} to={POST(post.id)}>
                  {post.title}
                </NavLink>
                <PostAuthor>by {post.user.name}</PostAuthor>
                <PostBody>{post.body}</PostBody>
              </Post>
            ))}
        <div>
          {!isNaN(totalPosts) && (
            <div>
              <div>
                <label>
                  Posts per Page:
                  <br />
                  {AVAILABLE_LIMITS.map(postsLimit => (
                    <ToggleButton
                      isActive={postsLimit === limit}
                      key={postsLimit}
                      value={postsLimit}
                      onClick={handleLimitSelect}
                    />
                  ))}
                </label>
              </div>
              <label>Page:</label>
              <div>
                {pageNos.map(pageNo => (
                  <ToggleButton
                    isActive={page === pageNo}
                    key={pageNo}
                    value={pageNo}
                    onClick={handlePageSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Column>
      <Column>
        <h4>Slow rendering</h4>
        <label>
          Enter something here:
          <br />
          <input
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </label>
        <p>So slow...</p>
        <ExpensiveTree />

        <h4>Closures</h4>
        <p>You clicked {count} times</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <button type="button" onClick={handleAlertClick}>
          Show alert
        </button>
      </Column>

      <Column>
        <h4>Incorrect form field behavior</h4>
        <button type="button" onClick={handlePush}>
          Add more
        </button>
        <ol>
          {fields.map(field => (
            <li key={field.id}>
              {field.name}:<br />
              <input
                type="text"
                value={field.inputValue}
                onChange={({ target }) =>
                  handleFormInput(target.value, field.id)
                }
              />
            </li>
          ))}
        </ol>
      </Column>
    </Container>
  )
}

export default Root
