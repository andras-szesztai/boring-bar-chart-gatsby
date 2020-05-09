import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { jsx, ThemeProvider } from "theme-ui"
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
    <ThemeProvider
      theme={{
        colors: {
          text: "#000",
          background: "#fff",
          primary: "#07c",
        },
        fonts: {
          body: "gill-sans-nova, sans-serif",
          heading: "gill-sans-nova, sans-serif",
        },
        fontWeights: {
          body: 400,
          heading: 700,
        },
        styles: {
          h1: {
            fontSize: 32,
            fontFamily: "heading",
            fontWeight: "heading",
            color: "primary",
            mt: 4,
            mb: 2,
          },
        },
      }}
    >
      <h1>{frontmatter.title}</h1>
      <p>Posted by: {frontmatter.author}</p>
      <MDXRenderer>{body}</MDXRenderer>
    </ThemeProvider>
  )
}

export default PostTemplate
