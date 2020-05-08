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
  ],
}
