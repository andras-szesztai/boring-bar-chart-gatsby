/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    query {
      allMdx(filter: { frontmatter: { title: { ne: "" } } }) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  if (result.error) {
    reporter.panic("Failed to create posts", result.errors)
  }

  const posts = result.data.allMdx.nodes

  posts.forEach(post => {
    actions.createPage({
      path: post.frontmatter.slug,
      component: require.resolve(
        "./src/components/templates/post/PostTemplate.jsx"
      ),
      context: {
        slug: post.frontmatter.slug,
      },
    })
  })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/visualizations/)) {
    page.context.layout = "visualizations"
    createPage(page)
  }
}
