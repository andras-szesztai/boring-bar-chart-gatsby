import React from "react"
import styled from "styled-components"
import { useTransition, animated } from "react-spring"
import PageTransition from "gatsby-plugin-page-transitions"

import { usePosts } from "../../hooks"
import { SiteHelmet } from "../../components/molecules"
import { MainGridContainer } from "../../components/atoms"
import { space } from "../../themes/theme"

const BlogPreview = styled(animated.div)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  border-radius: ${space[1]}px;

  height: 25rem;

  will-change: transform, opacity;
`

export default function() {
  const posts = usePosts()
  const transitions = useTransition(posts, item => item.slug, {
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
  leave: { opacity: 0, transform: "scale(0)" },
  })
  return (
    <>
      <SiteHelmet pageTitle="Boring Bar Chart - Blog posts" />
      <PageTransition>
        <MainGridContainer>
          {transitions.map(({ item, key, props }) => (
            <BlogPreview key={key} style={props} />
          ))}
        </MainGridContainer>
      </PageTransition>
    </>
  )
}
