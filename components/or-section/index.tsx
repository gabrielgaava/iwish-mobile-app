import styled, { useTheme } from "styled-components/native";
import { Container } from "../ui/container";
import { Txt } from "../ui/text";

type OrSectionProps = {
  text: string;
}

export const OrSection = (props: OrSectionProps) => {
  const { colors } = useTheme();

  return (
    <Row type="row" align="center" stretch>
      <Line />
      <TextContent>
        <Txt text={props.text} color={colors.text70} align="center"/>
      </TextContent>
      <Line />
    </Row>
  )
}

const Row = styled(Container)`
  margin-top: 10px;
  gap: 16px;
  margin-bottom: 16px;
  justify-content: center;
`

const Line = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  flex: 1px;
`

const TextContent = styled.View`
  flex: 1.5;
  width: 100%;
  flex-direction: row;
  justify-content: center;
`
