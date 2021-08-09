import client from "../client";

const takeNum = 2;

export default {
  User: {
    following: async ({ id }, { lastId }) =>
      await client.user.findUnique({ where: { id } }).following({
        take: 2,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
    followers: async ({ id }, { lastId }) =>
      await client.user.findUnique({ where: { id } }).followers({
        take: 2,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),     

    totalFollowing: ({ id }) =>
      client.user.count({ where: { followers: { some: { id } } } }),

    totalFollowers: ({ id }) =>
      client.user.count({ where: { following: { some: { id } } } }),

    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },

    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: { id: loggedInUser.id, following: { some: { id } } },
      });
      return Boolean(exists);
    },
  },
};
