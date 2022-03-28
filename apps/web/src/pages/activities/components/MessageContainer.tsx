import styled from '@emotion/styled';
import { colors, Text } from '../../../design-system';

export function MessageContainer() {
  return (
    <>
      <Wrapper>
        <StyledTitle>YOUR ACTIVITY FEED</StyledTitle>
        <StyledText>Here you will see the activity graph once you send some events</StyledText>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  padding: 12px 15px 14px;
  height: 64px;
  background: ${colors.B20};
  border-radius: 7px;
  z-index: 2;
`;

const StyledTitle = styled(Text)`
  background: -webkit-linear-gradient(90deg, #dd2476 0%, #ff512f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 11px;
  margin: 12px 0 8px 0;
`;

const StyledText = styled(Text)`
  margin: 0 15px 14px 15px;
`;
