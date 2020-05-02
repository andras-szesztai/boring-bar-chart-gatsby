module.exports = {
  siteMetadata: {
    title: `Boring Bar Chart`,
    description: `A Data Visualisation Site`,
    author: `@AndSzesztai`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `w36cqgpg2pdu`,
        accessToken: 'ih7LJB9xSp9alB5BlKkaxBKmCdtDhG2Rknw_xe5PDdY',
      },
    },
  ],
}

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
  