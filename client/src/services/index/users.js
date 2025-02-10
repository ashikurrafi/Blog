import axios from "axios";

export const signup = async ({ name, email, password }) => {
  try {
    const { data } = await axios.post(`/api/v1/user/register`, {
      name,
      email,
      password,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
