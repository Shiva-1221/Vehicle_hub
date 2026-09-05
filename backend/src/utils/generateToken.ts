import  jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}

const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d"
    }
  );
};

export default generateToken;