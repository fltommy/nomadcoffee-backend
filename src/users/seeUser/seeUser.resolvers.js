import client from "../../client";

export default {
  Query: {
    seeUserFollowers: async (_, { username, page }) => {    
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      // console.log(ok);
      if (!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }    
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };       
    },
  
    seeUserFollowing: async (_, { username, lastId }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      // console.log(ok);
      if (!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      
      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
      return {
        ok: true,
        following,
      };
    },
  },
};