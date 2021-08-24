import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  // console.log(token);
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.PRIVATE_KEY);
    // console.log(id);
    const user = await client.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
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