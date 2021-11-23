import styled from "styled-components/native";

export const Container = styled.TouchableOpacity<{color: string}>`
  height: 50px;
  width: 100%;
  flex-shrink: 1;
  background-color: ${({color}) => color};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-color: white;
  border-width: 1px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export const Description = styled.Text`
  padding-right: 5px;
`;