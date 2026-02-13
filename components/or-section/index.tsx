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
        <Txt text={props.text} color={colors.text70} />
      </TextContent>
      <Line />
    </Row>
  )
}

const Row = styled(Container)`
  margin-top: 10;
  gap: 16;
  margin-bottom: 16;
`

const Line = styled.View`
  height: 1;
  background-color: ${props => props.theme.colors.border};
  flex: 1;
`

const TextContent = styled.View`
  flex: 1.5;
  width: "100%";
  flex-direction: "row";
`
