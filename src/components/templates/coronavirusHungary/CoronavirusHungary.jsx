import React, { useEffect, useReducer, useRef, useState } from "react"
import Helmet from "react-helmet"
import _ from "lodash"
import Modal from "react-modal"
import { useSpring } from "react-spring"

import {
  usePrevious,
  useDeviceType,
  useScrollPosition,
  useWindowDimensions,
} from "../../../hooks"
import { TEXT } from "../../../constants/visualizations/coronavirusHungary"
import {
  BrowserDashboard,
  MobileDashboard,
} from "../../organisms/templateElemets/coronavirusHungary/DeviceDashboards"
import {
  coronavirusDashboardReducer,
  coronavirusDashboardInitialState,
  actions,
} from "../../../reducers/coronavirusDashboard/coronavirusDashboardReducer"
import { z } from "../../../themes/theme"
import { FlexContainer } from "../../atoms"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    zIndex: z.modal,
    cursor: "pointer",
  },
}

function CoronaVirusHungaryDashboard({ data, enData, loading }) {
  const [state, dispatch] = useReducer(
    coronavirusDashboardReducer,
    coronavirusDashboardInitialState
  )
  const prevState = usePrevious(state)
  const filterContainerRef = useRef(null)
  const scrollPosition = useScrollPosition()
  const { windowWidth } = useWindowDimensions()
  const [containerPosition, setContainerPosition] = useState(undefined)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!containerPosition && filterContainerRef.current) {
      setContainerPosition(filterContainerRef.current.getBoundingClientRect())
    }
  })

  const isBelowPosition =
    !loading && containerPosition && containerPosition.top < scrollPosition

  const {
    setFormattedData,
    setLanguage,
    setInitialDates,
    setFilteredData,
    setNumbers,
    setAverages,
    setFullListDomain,
    updateCurrDate,
    updateDisplay,
    setDataSets,
  } = actions

  useEffect(() => {
    if (data && !state.dataSets.formattedData) {
      setFormattedData(dispatch, { data: data })
      setInitialDates(dispatch)
      setFilteredData(dispatch)
      setDataSets(dispatch)
      setNumbers(dispatch)
      setAverages(dispatch)
      setFullListDomain(dispatch)
    }
    if (prevState) {
      if (prevState.language !== state.language) {
        const currData = state.language === "en" ? enData : data
        setFormattedData(dispatch, { data: currData })
        setFilteredData(dispatch)
      }
      if (!_.isEqual(state.dates.currDate, prevState.dates.currDate)) {
        setFilteredData(dispatch)
        setNumbers(dispatch)
        setAverages(dispatch)
      }
    }
  })

  const device = useDeviceType()

  const isTablet = device === "tablet"
  const isBrowser = device === "desktop"
  const isMobile = device === "mobile"

  const [cardClicked, setCardClicked] = useState(false)
  useEffect(() => {
    if (cardClicked) {
      clearTimeout()
      setTimeout(() => {
        setCardClicked(false)
      }, 2000)
    }
  }, [cardClicked])
  const props = useSpring({
    top: cardClicked && isBelowPosition ? -1000 : 0,
  })

  const [isModal, setIsModal] = useState(undefined)

  return (
    <>
      <Helmet title={TEXT.helmet[state.language]} />
      {isModal && (
        <Modal
          isOpen={isModal}
          style={customStyles}
          onRequestClose={() => setIsModal(undefined)}
          contentLabel="Example Modal"
        >
          <FlexContainer>{isModal}</FlexContainer>
        </Modal>
      )}
      {(isBrowser || isTablet) && (
        <BrowserDashboard
          state={state}
          dispatch={dispatch}
          setLanguage={setLanguage}
          updateCurrDate={updateCurrDate}
          updateDisplay={updateDisplay}
          numbers={state.numbers}
          setIsModal={setIsModal}
          loading={loading}
          windowWidth={windowWidth}
          filterContainerRef={filterContainerRef}
          isBelowPosition={isBelowPosition}
          device={device}
          setCardClicked={setCardClicked}
          filterTransitionProps={props}
        />
      )}
      {isMobile && (
        <MobileDashboard
          state={state}
          dispatch={dispatch}
          setLanguage={setLanguage}
          updateCurrDate={updateCurrDate}
          setIsModal={setIsModal}
          updateDisplay={updateDisplay}
          numbers={state.numbers}
          loading={loading}
          windowWidth={windowWidth}
          filterContainerRef={filterContainerRef}
          isBelowPosition={isBelowPosition}
          setCardClicked={setCardClicked}
          filterTransitionProps={props}
        />
      )}
    </>
  )
}

export default CoronaVirusHungaryDashboard
