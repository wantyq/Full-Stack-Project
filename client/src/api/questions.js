import axios from "axios";

const SERVER_URL = "http://localhost:3000";
const GET_ALL = `${SERVER_URL}/questions`;

export const getQuestions = () => {
  return axios.get(GET_ALL).then((response) => response.data);
};