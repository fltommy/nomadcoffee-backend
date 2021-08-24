import { createWriteStream } from "fs";
import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../../users/users.utils";

export default {
    Mutation: {
        editCoffeeShop: protectedResolver(
            async (
                _,
                { id, name, latitude, longitude, categoryName, categorySlug },
                { loggedInUser }
            ) => {
                const oldShop = await client.coffeeShop.findFirst({
                    where: {
                        id,
                        userId: loggedInUser.id,
                    },
                    include: {
                        categories: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });
                if (!oldShop) {
                    return {
                        ok: false,
                        error: "You can not edit this shop",
                    };
                }
                const exist = await client.coffeeShop.findFirst({
                    where: { name },
                    select: { name: true },
                });
                if (exist) {
                    return {
                        ok: false,
                        error: "That name has taken Try other name",
                    };
                }

                let categoryObj = {
                    where: { name: categoryName },
                    create: { name: categoryName, slug: categorySlug },
                };

                await client.coffeeShop.update({
                    where: {
                        id,
                    },
                    data: {
                        name,
                        latitude,
                        longitude,
                        categories: {
                            disconnect: oldShop.categories,
                            connectOrCreate: categoryObj
                        },
                    },
                });
                return {
                    ok: true,
                };
            }
        ),
    },
};