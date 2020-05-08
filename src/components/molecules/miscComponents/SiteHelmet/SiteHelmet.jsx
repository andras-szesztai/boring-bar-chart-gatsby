import React from "react"
import Helmet from "react-helmet"
import { graphql, useStaticQuery } from "gatsby"

function SiteHelmet({ pageTitle }) {
  const {
    site: {
      siteMetadata: { author, description, title, keywords },
    },
  } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          author
          description
          title
        }
      }
    }
  `)
  return (
    <Helmet>
      <html lang="en" />
      <meta charset="UTF-8" />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="description" content={description} />
      <title>{pageTitle || title}</title>
    </Helmet>
  )
}

export default SiteHelmet
