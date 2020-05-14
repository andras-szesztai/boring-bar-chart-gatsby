module.exports = {
  siteMetadata: {
    title: "Boring Bar Chart",
    description:
      "A data visualization and blog site that provides a collection of interactive dashboards and charts built by using mainly d3.js and React.",
    keywords:
      "Data Visualization, React, D3.js, Interactive, Dashboard, Blog, Gatsby, Javascript, Animation",
    author: "András Szesztai",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-mdx",
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-layout",
    {
      resolve: "gatsby-plugin-page-transitions",
      options: {
        transitionTime: 500,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/posts`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "animated-icons",
        path: `${__dirname}/src/icons/animatedIcons`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-emotion",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        display: "minimal-ui",
        icon: "src/images/logo.png", // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-source-contentful",
      options: {
        spaceId: "w36cqgpg2pdu",
        accessToken: "ih7LJB9xSp9alB5BlKkaxBKmCdtDhG2Rknw_xe5PDdY",
      },
    },
    // {
    //   resolve: `gatsby-plugin-page-creator`,
    //   options: {
    //     path: `${__dirname}/posts`,
    //   },
    // },
  ],
}

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
