import React from "react"
import { useTransition } from "react-spring"
import PageTransition from "gatsby-plugin-page-transitions"

import { usePosts } from "../../hooks"
import { SiteHelmet } from "../../components/molecules"
import { MainGridContainer, ItemPreviewContainer } from "../../components/atoms"

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
            <ItemPreviewContainer key={key} style={props} >
              Coming soon
            </ItemPreviewContainer>
          ))}
        </MainGridContainer>
      </PageTransition>
    </>
  )
}
