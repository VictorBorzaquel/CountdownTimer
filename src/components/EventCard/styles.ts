import styled from "styled-components/native";

export const Container = styled.View<{complete: boolean}>`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({complete}) => complete ? '#ffe3e3' : '#fff'};
  padding: 10px;
`;

export const TimeDisplayContainer = styled.View`
  align-items: center;
  padding-left: 15px;
`;

export const Time = styled.Text`
  font-size: 27px;
  font-weight: bold;
`;

export const Description = styled.Text`
  margin-top: -5px;
  font-size: 11px;
`;

export const Timer = styled.View`
  flex-direction: row;
`;

export const Content = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 24px;
  padding-bottom: 5px;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: #b91111;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;