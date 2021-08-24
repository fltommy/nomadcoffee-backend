import client from "../../client";
import { createWriteStream } from "fs";
import { protectedResolver } from "../../users/users.utils";
import { randomInt } from "crypto";

export default {
    Mutation: {
        createCoffeeShop: protectedResolver(async (_,
            { name, latitude, longitude, url, categoryName, categorySlug },
            { loggedInUser }) => {
            try {

                const existCheck = await client.coffeeShop.findFirst({
                    where: { name },
                    select: { name: true },
                });
                if (existCheck) {
                    return {
                        ok: false,
                        error: "That name has taken!",
                    };
                }

                // todo : if categogy slug exist, maybe slug auto generate to unique
                const categorySlugExistCheck = await client.category.findFirst({
                    where: { slug: categorySlug },
                    select: { slug: true },
                });
                if (categorySlugExistCheck) {
                    // return {
                    //     ok: false,
                    //     error: "That Category name duplication OK. but, slug need unique!",
                    // };

                    // connectOrCreate Rule where name is,
                    // if name is exist, then just connect.
                    // if name is new but same slug, then create new name and new random slug.
                    categorySlug = categorySlug + "-" + randomInt(9999);
                }


                let categoryObj = {
                    where: { name: categoryName },
                    create: { name: categoryName, slug: categorySlug },
                };

                let newUrl = null;
                let photoObj = null;
                if (url) {
                    const { filename, createReadStream } = await url;
                    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
                    const readStream = createReadStream();
                    const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
                    readStream.pipe(writeStream);
                    newUrl = `http://localhost:4000/static/${newFilename}`;

                    photoObj = {
                        where: { url: newUrl },
                        create: { url: newUrl },
                    };
                }

                let shop = await client.coffeeShop.create({
                    data: {
                        name,
                        ...(latitude && { latitude }),
                        ...(longitude && { longitude }),
                        user: {
                            connect: {
                                id: loggedInUser.id
                            }
                        },
                        ...(photoObj && {
                            photos: {
                                connectOrCreate: photoObj
                            },
                        }),
                        categories: {
                            connectOrCreate: categoryObj
                        }
                    }
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

        })
    }
};