import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 10px;
  border-bottom-color: #dbdbdb;
  border-bottom-width: 1px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export const Footer = styled.View`
  background-color: #d4d4d4;
`;

export const FooterContent = styled.View`
margin: 10px;
  
`;

export const WarnMessage = styled.Text`
  color: #ec4141;
  font-size: 16px;
  padding: 5px 15px;
  background-color: #fff;
`;

export const ButtonWrapper = styled.View`
  flex-direction: row;
`;

export const Name = styled.TextInput`
  height: 50px;
  padding: 0 15px;
  background-color: #e6e6e6;
  border-color: white;
  border-width: 1px;
`;

export const HelpButtonWrapper = styled.View`
  width: 33%;
`;