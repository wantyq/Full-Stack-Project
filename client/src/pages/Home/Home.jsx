import * as Yup from "yup";

import { ErrorMessage, Form, Formik } from "formik";
import { HOME_PATH, LOGIN_PATH } from '../../routes/const';

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    userId: Yup.string(),
    description: Yup.string()
      .max(1000, 'Must be 1000 characters or less')
      .required(''),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post("http://localhost:3000/questions", values);
      navigate(HOME_PATH);
      toast.success("You just posted a question");
    } catch (error) {
      console.error("Failed to create a new question:", error);
      toast.error("Failed to post a new question. Try again.");
    }
    setSubmitting(false);
    resetForm();
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;
    if (!isAuthenticated) {
      navigate(LOGIN_PATH);
    }
  }, [navigate]);

  return (
    <div>
      <FormWrapper>
        <Formik
          initialValues={{
            firstName: `${user.firstName}`,
            lastName: `${user.lastName}`,
            userId: `${user._id}`,
            description: "",
            likes: {},
            dislikes: {},
            comments: []
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Title>Simply create a new topic here!</Title>
              <FormikInput
                name="description"
                type="textarea"
                label="Textarea Field"
                rows="4"
                cols="50"
                placeholder="Enter your question here"
              />
              <ErrorMessage name="description" component="div" />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </div>
  );
};

export default Home;


const FormWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  margin: 0 auto;
  padding: 32px 80px;
  border-radius: 6px;
  box-shadow: -16px 17px 31px 8px rgba(0,0,0,0.1);
`;

const Title = styled.p`
  font-size: 24px;
  text-align: center;
  margin-bottom: 16px;
  font-weight: 700;
`;


