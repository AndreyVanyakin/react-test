import React, { useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import { useQuery } from '@apollo/client'
import arrayMove from 'array-move'

import postQuery from 'GraphQL/Queries/post.graphql'

import { POST, ROOT } from 'Router/routes'

import {
  Back,
  Column,
  Container,
  PostAuthor,
  PostBody,
  PostComment,
  PostContainer,
} from './styles'

const SortableContainer = sortableContainer(({ children }) => (
  <div>{children}</div>
))

const SortableItem = sortableElement(({ value }) => (
  <PostComment mb={2}>{value}</PostComment>
))

function Post() {
  const [comments, setComments] = useState([])
  const history = useHistory()
  const location = useLocation()
  const {
    params: { postId },
  } = useRouteMatch()

  // Мне не нравится это решение, лучше конечно иметь соседей в результате запроса Post
  const prevPostId = location?.state?.prevPostId || Number(postId) - 1
  const nextPostId = location?.state?.nextPostId || Number(postId) + 1

  const handleClick = () => history.push(ROOT)
  const handleNavigate = pid => history.push(POST(pid))

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setComments(arrayMove(comments, oldIndex, newIndex))
  }

  const { data, loading } = useQuery(postQuery, { variables: { id: postId } })

  const post = useMemo(() => data?.post || {}, [data])

  useEffect(() => {
    setComments(post.comments?.data || [])
  }, [post])

  return (
    <Container>
      <Column>
        <Back onClick={handleClick}>Back</Back>
      </Column>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <Column>
            <h4>Need to add next/previous links</h4>
            <PostContainer key={post.id}>
              <h3>{post.title}</h3>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody mt={2}>{post.body}</PostBody>
            </PostContainer>
            <div>
              <button type="button" onClick={() => handleNavigate(prevPostId)}>
                Prev
              </button>
              <button type="button" onClick={() => handleNavigate(nextPostId)}>
                Next
              </button>
            </div>
          </Column>

          <Column>
            <h4>Incorrect sorting</h4>
            Comments:
            <SortableContainer onSortEnd={handleSortEnd}>
              {comments.map((comment, index) => (
                <SortableItem
                  index={index}
                  key={comment.id}
                  mb={3}
                  value={comment.body}
                />
              ))}
            </SortableContainer>
          </Column>
        </>
      )}
    </Container>
  )
}

export default Post
