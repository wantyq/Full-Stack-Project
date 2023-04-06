import Sidebar from "../components/Sidebar/Sidebar";
import { bgColor } from "../assets/consts/colors";
import styled from "styled-components";

const MainLayout = ({ children }) => {
  return (
    <Content>
      <LeftSide>
        <Sidebar />
      </LeftSide>
      <RightSide>{children}</RightSide>
    </Content>
  )
}

export default MainLayout;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftSide = styled.div`
  border: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
`;

const RightSide = styled.div`
  background-color: ${bgColor};
  padding: 72px;
  flex: 5;
  overflow-y: scroll;
  margin-left: 260px;
`;