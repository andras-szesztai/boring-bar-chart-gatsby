import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"
import { colors } from "../themes/theme"

const SOCIAL_LINKS = [
  {
    link: "https://twitter.com/AndSzesztai",
    component: FaTwitter,
    componentProps: {color: colors.grayDarkest, size: 25}
  },
  {
    link: "https://github.com/andras-szesztai",
    component: FaGithub,
    componentProps: {color: colors.grayDarkest, size: 25}
  },
  {
    link: "https://www.linkedin.com/in/andr%C3%A1s-szesztai-351a4379/",
    component: FaLinkedin,
    componentProps: {color: colors.grayDarkest, size: 27}
  }
]


export default SOCIAL_LINKS