import * as Yup from "yup";

import { Form, Formik } from "formik";
import { HOME_PATH, LOGIN_PATH } from "../../routes/const";

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import { Link } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/images/bgImage.jpeg";
import { mainColor } from "../../assets/consts/colors";
import styled from "styled-components";
import { toast } from "react-hot-toast";

const Register = () => {

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    try {
      const response = await axios.post("http://localhost:3000/register", values);
      const { token } = response.data;
      console.log(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Successfully registered");
      window.location.href = HOME_PATH;
    } catch (error) {
      console.error("failed to create a new user", error);
      toast.error("Something went wrong. Please try again!");
    }
    setSubmitting(false);
    resetForm();
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Formik initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: ""
        }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <StyledForm>
            <Title>Register Your Account</Title>
            <FormikInput type="text" name="firstName" placeholder="First Name" />
            <FormikInput type="text" name="lastName" placeholder="Last Name" />
            <FormikInput type="email" name="email" placeholder="Email" />
            <FormikInput type="password" name="password" placeholder="Password" />
            <Button type="submit">Submit</Button>
            <StyledLinkBlock>
              <p>Already registered user?</p>
              <StyledLink to={LOGIN_PATH}>Log In</StyledLink>
            </StyledLinkBlock>
          </StyledForm>
        </Formik>
      </FormWrapper>
    </Wrapper>
  )
};

export default Register

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