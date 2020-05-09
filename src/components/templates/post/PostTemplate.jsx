import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import { css } from "@emotion/core"

export const query = graphql`
  query($slug: String!){
    mdx(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title,
        author
      }
      body
    }
  }
`

const PostTemplate = ({data}) => {
  console.log(data)
  return (
    <>
      <h1>Post title</h1>
      <p>Posted by: author</p>
      <p>Post body goes here</p>
    </>
  )
}

export default PostTemplate
