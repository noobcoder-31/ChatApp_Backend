import jwt from "jsonwebtoken";

const getToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
  return token;
};

export default getToken;
