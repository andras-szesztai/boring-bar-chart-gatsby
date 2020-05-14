import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import Lottie from "react-lottie"

import { FavoriteStar as FavoriteStarIcon } from "../../../../../assets/icons/"
import { COLORS } from "../../../../../constants/moviesDashboard"

export default function FavoriteStar() {
  return <FavoriteStarIcon width={20} height={20} fill={COLORS.favorite} />
}
