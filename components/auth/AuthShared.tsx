import styled from "styled-components/native";

export const TextInput = styled.TextInput<{
  lastOne: boolean;
  theme: any;
  isDark: boolean;
}>`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 16px 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.isDark ? "white" : "#1e272e")};
  color: ${(props) => props.theme.textColor};
  margin-bottom: ${(props) => (props.lastOne ? "32" : "8")}px;
`;
