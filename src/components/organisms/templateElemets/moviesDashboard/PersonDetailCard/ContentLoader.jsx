import React from "react"
import ContentLoader from "react-content-loader"
import { motion } from "framer-motion"
import {
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../constants/moviesDashboard"

export default function({ isOpen }) {
  
  return (
    <motion.div variants={OPACITY_VARIANT} {...ANIMATE_PROPS}>
      {isOpen ? (
        <ContentLoader
          speed={2}
          width={400}
          height={200}
          viewBox="0 0 400 200"
          backgroundColor="#f3f3f3"
          foregroundColor="#c0c0c0"
          style={{
            position: "absolute",
          }}
        >
          <rect x="5" y="6" rx="3" ry="3" width="255" height="36" />
          <rect x="5" y="45" rx="3" ry="3" width="255" height="150" />
          <rect x="264" y="6" rx="3" ry="3" width="132" height="189" />
        </ContentLoader>
      ) : (
        <ContentLoader
          speed={2}
          width={400}
          height={50}
          viewBox="0 0 400 45"
          backgroundColor="#f3f3f3"
          foregroundColor="#c0c0c0"
          style={{
            position: "absolute",
            bottom: 4,
          }}
        >
  <rect x="40" y="0" rx="3" ry="3" width="355" height="42" />
        </ContentLoader>
      )}
    </motion.div>
  )
}
