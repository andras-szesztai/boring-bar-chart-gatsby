import { graphql, useStaticQuery } from "gatsby"

export default function usePosts() {
  const data = useStaticQuery(graphql`
    {
      allMdx(filter: { frontmatter: { title: { ne: "" } } }) {
        nodes {
          frontmatter {
            author
            slug
            title
          }
          excerpt
        }
      }
    }
  `)

  return data.allMdx.nodes.map(post => ({
    author: post.frontmatter.author,
    slug: post.frontmatter.slug,
    title: post.frontmatter.title,
    excerpt: post.excerpt,
  }))
}
