import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { jsx, ThemeProvider } from "theme-ui"
import { css } from "@emotion/core"

import theme from "../../../gatsby-plugin-theme-ui/theme"
import components from "../../../gatsby-plugin-theme-ui/components"

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
    <ThemeProvider
      theme={theme}
      components={components}
    >
      <h1>{frontmatter.title}</h1>
      <p>Posted by: {frontmatter.author}</p>
      <MDXRenderer>{body}</MDXRenderer>
    </ThemeProvider>
  )
}

export default PostTemplate
