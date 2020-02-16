import React from "react"
import Image from "gatsby-image"

import { ModalContainer, CreditsContainer } from "../../../molecules"
import {
  GridContainer,
  Title,
  FlexContainer,
  LinkAnchor,
  Container,
} from "../../../atoms"
import {
  BOX_PLOT_EXPLAIN,
  CREDIT_ELEMENTS,
} from "../../../../constants/chessPlayersDashboard"

export default function ModalComponent({ shouldModalToggle, image }) {
  return (
    <ModalContainer
      shouldToggle={shouldModalToggle}
      height="600px"
      width="1150px"
    >
      <GridContainer
        paddingTop={2}
        paddingLeft={3}
        paddingRight={3}
        paddingBottom={2}
        columnGap={3}
        rowGap={2}
        rows="repeat(2, 1fr)"
        columns="repeat(4, 1fr)"
        areas='"datasource boxplot boxplot boxplot"
                  "datasource interact interact credit"'
        fullSize
      >
        <GridContainer gridArea="datasource" rows="min-content 1fr">
          <Title fontSize={2} fontWeight={3}>
            About the data
          </Title>
          <FlexContainer
            align="flex-start"
            justify="flex-start"
            direction="column"
          >
            <FlexContainer
              align="flex-start"
              justify="flex-start"
              paddingTop={2}
              fontSize={1}
            >
              <div>
                The{" "}
                <LinkAnchor href="https://www.kaggle.com/liury123/chess-game-from-12-top-players">
                  base dataset
                </LinkAnchor>{" "}
                for this dashboard was collected by{" "}
                <LinkAnchor href="https://www.kaggle.com/liury123">
                  Liu Renyu
                </LinkAnchor>{" "}
                on the games played by 12 great chess masters in history, hosted
                in{" "}
                <LinkAnchor href="https://www.chess.com/">chess.com</LinkAnchor>
                's database.
              </div>
            </FlexContainer>

            <FlexContainer
              align="flex-start"
              justify="flex-start"
              paddingTop={3}
            >
              <div>
                The idea behind this dashboard was to analyse and compare the
                their game style, results, and evolution of different
                grandmasters across in different phases of their career. ...
              </div>
            </FlexContainer>
          </FlexContainer>
        </GridContainer>
        <GridContainer gridArea="boxplot" rows="min-content 1fr">
          <Title fontSize={2} fontWeight={3}>
            What are box plots and how to read them?
          </Title>
          <GridContainer
            columns="repeat(3, 1fr)"
            columnGap={3}
            areas='"text img img"'
          >
            <FlexContainer
              justify="flex-start"
              align="flex-start"
              direction="column"
              paddingTop={2}
            >
              Box plots are a standardized way of displaying the distribution of
              data based on a five number summary.
              {BOX_PLOT_EXPLAIN.map(({ title, text }) => (
                <Container paddingTop={1}>
                  <Title fontWeight={3}>{title}:</Title> {text}
                </Container>
              ))}
            </FlexContainer>
            <FlexContainer gridArea="img">
              <Image
                style={{ width: 250, borderRadius: 2 }}
                fluid={image[0].fluid}
              />
            </FlexContainer>
          </GridContainer>
        </GridContainer>
        <GridContainer gridArea="interact" rows="min-content 1fr">
          <Title fontSize={2} fontWeight={3}>
            How to interact with the dashboard?
          </Title>
          <GridContainer columns="repeat(2, 1fr)" columnGap={3}>
            <FlexContainer
              justify="flex-start"
              align="flex-start"
              direction="column"
              paddingTop={2}
            >
              Interaction description
            </FlexContainer>
            <FlexContainer paddingTop={2}>Gif</FlexContainer>
          </GridContainer>
        </GridContainer>
        <FlexContainer
          gridArea="credit"
          justify="flex-start"
          align="flex-end"
          paddingBottom={1}
        >
          <CreditsContainer
            justify="flex-end"
            direction="column"
            fontSize={1}
            elements={CREDIT_ELEMENTS}
            absPos={false}
          />
        </FlexContainer>
      </GridContainer>
    </ModalContainer>
  )
}
