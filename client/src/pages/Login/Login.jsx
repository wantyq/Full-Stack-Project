import * as Yup from "yup";

import { Form, Formik } from "formik";
import { HOME_PATH, REGISTER_PATH } from "../../routes/const";

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import { Link } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/images/bgImage.jpeg";
import { mainColor } from "../../assets/consts/colors";
import styled from "styled-components";
import { toast } from "react-hot-toast";

const Login = () => {

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  })
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post("http://localhost:3000/login", values);
      const { token } = response.data;
      console.log(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Successfully logged in");
      window.location.href = HOME_PATH;
    } catch (error) {
      console.error("failed to log in", error);
      toast.error("Failed to log in. Check your credentials");
    }
    setSubmitting(false);
    resetForm();
  };
  
  return (
    <Wrapper>
      <FormWrapper>
        <Formik initialValues={{
          email: "",
          password: "",
        }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
            <StyledForm>
              <Title>Login Form</Title>
              <FormikInput type="email" name="email" placeholder="Email" />
              <FormikInput type="password" name="password" placeholder="Password" />
              <Button type="submit">Login</Button>
              <StyledLinkBlock>
                <p>Not a member yet?</p>
                <StyledLink to={REGISTER_PATH}>Join us now!</StyledLink>
              </StyledLinkBlock>
            </StyledForm>
        </Formik>
      </FormWrapper>
    </Wrapper>
  )
}

export default Login

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-image: url(${bgImage});
`;

const FormWrapper = styled.div`
  width: 400px;
  background-color: white;
  margin: 0 auto;
  padding: 32px 80px;
  border-radius: 6px;
  box-shadow: -16px 17px 31px 8px rgba(0,0,0,0.1);
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Title = styled.p`
  font-size: 24px;
  text-align: center;
  margin-bottom: 16px;
  font-weight: 700;
`;

const StyledLinkBlock = styled.div`
  display: flex;
  margin: 16px;
  flex: row;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const StyledLink = styled(Link)`
  text-align: center;
  font-size: 18px;
  text-decoration: none;
  font-weight: 600;
  color: ${mainColor};
`;
