import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Post from "../../../../posts/00-first-post/first-post.mdx"

import { css } from "@emotion/core"

export const query = graphql`
  query MdxBlogPost($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title
        author
      }
      body
    }
  }
`

const PostTemplate = ({ data: { mdx: post } }) => {
  const { frontmatter, body } = post
  return (
    <>
      <h1>{frontmatter.title}</h1>
      <p>Posted by: {frontmatter.author}</p>
      <MDXRenderer>{body}</MDXRenderer>
    </>
  )
}

export default PostTemplate
