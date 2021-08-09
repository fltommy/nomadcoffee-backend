import client from "../../client";
import { protectResolver } from "../users.utils";

export default {
  Mutation: {
    unfollowUser: protectResolver(async (_, { username }, { loggedInUser }) => {
      try {
        const exist = await client.user.findUnique({ where: { username } });
        if (!exist) {
          return {
            ok: false,
            error: "Can't unfollow user.",
          };
        }
        await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            following: {
              disconnect: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          error,
        };
      }
    }),
  },
};
