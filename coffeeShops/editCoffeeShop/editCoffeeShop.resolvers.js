import { createWriteStream } from "fs";
import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../../users/users.utils";

export default {
    Mutation: {
        editCoffeeShop: protectedResolver(async(_,{
            shopName,
            newShopName,
            latitude,
            longitude,
            url,
            },{loggedInUser}) => {
                let newUrl = null;
                let photoObj = null;

                const shopOwnerId = await client.coffeeShop.findUnique({
                    where:{
                        name: shopName
                    },
                    select:{
                        UserId: true
                    }
                });

                if (shopOwnerId.UserId !== loggedInUser.id) {
                    return {
                        ok: false,
                        error: "Not Authorized"
                    }
                }

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

                const updateShop = await client.coffeeShop.update({
                    where:{
                        name: shopName
                    },
                    data:{
                        ...(newShopName && {name: newShopName}),
                        ...(latitude && {latitude}),
                        ...(longitude && {longitude}),
                        ...(url && {photos: {
                            connectOrCreate: photoObj
                        }})
                    }
                });

                if (updateShop.id){
                    return {
                        ok: true,
                    };
                } else {
                    return {
                        ok: false,
                        error: "could not update coffeeShop",
                    };
                }
        })
    }
};
