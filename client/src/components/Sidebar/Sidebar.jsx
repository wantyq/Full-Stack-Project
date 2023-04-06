import { HOME_PATH, LOGIN_PATH, QUESTIONS_PATH } from "../../routes/const";
import { midnightGreen, mintCream } from "../../assets/consts/colors";

import { Link } from "react-router-dom";
import avatar from "../../assets/images/avatar.png"
import styled from "styled-components";

const Sidebar = () => {
  
  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser); 

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = LOGIN_PATH;
  }

  return (
    <Wrapper>
      <UserArea>
        <Avatar/>
        <UserInformation>
          {user.firstName + ' ' + user.lastName}
          <UserEmail>{user.email}</UserEmail>
        </UserInformation>
      </UserArea>
      <MenuWrapper>
        <StyledLink to={HOME_PATH}>
          <MenuItem>
            Home
          </MenuItem>
        </StyledLink>
          <StyledLink to={QUESTIONS_PATH}>
            <MenuItem>
              Create a New question
            </MenuItem>
          </StyledLink>
          <MenuItem onClick={handleLogout}>
            Log out
          </MenuItem>
      </MenuWrapper>
    </Wrapper>
  )
}

export default Sidebar;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 42px;
    background-color: ${midnightGreen};
    height: 100vh;
    z-index: 1;
    flex: 1;
    width: 240px;
    padding-top: 8px;
    padding: 16px;
`;

const UserArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  background-size: cover;
  border-radius: 100%;
  border: 3px solid rgb(255, 255, 255, 0.7);
  background-image: url(${avatar});
`;

const UserInformation = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  text-transform: capitalize;
  font-size: 22px;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #dbd9d9;
  text-transform: none;
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const MenuItem = styled.div`
  border: 2px solid ${mintCream};
  text-decoration: none;
  border-radius: 4px;
  color: ${mintCream};
  padding: 8px;
  font-weight: 600;
  cursor: pointer;;

  &:hover {
    background-color: ${mintCream};
    color: ${midnightGreen};
  }
`;