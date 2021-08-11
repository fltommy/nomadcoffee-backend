import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  if (!token) {
    return null;
  }
  const verifiedToken = await jwt.verify(token, process.env.PRIVATE_KEY);
  if (verifiedToken.id) {
    const user = await client.user.findUnique({
      where: { id: verifiedToken.id },
    });
    if (user) {
      return user;
    }
    return null;
  }
  return null;
};

export const protectedResolver = (resolver) => (parent, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: "Please log in to perform this action.",
    };
  }
  return resolver(parent, args, context, info);
};