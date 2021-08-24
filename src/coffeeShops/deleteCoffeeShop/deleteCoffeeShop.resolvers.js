import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deleteCoffeeShop: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const coffeeShop = client.coffeeShop.findUnique({ where: { id } });

      // TODO : review check shop owner before delete ?

      if (!coffeeShop) {
        return {
          ok: false,
          error: "Coffee Shop not found!",
        };
      }
      await client.coffeeShop.delete({
        where: { id },
      });
      return {
        ok: true,
      };
    }),
  },
};
