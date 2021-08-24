import client from "../../client";

export default {
    Query: {
        seeCoffeeShops: async (_, { lastId }) => await client.coffeeShop.findMany({
            take: 5,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
            include: {
                user: true,
                photos: true,
                categories: true
            },
        })
    }
};



// export default {
//     Query: {
//         seeCoffeeShops: (_, { page }) =>
//             client.coffeeShop.findMany({
//                 skip: (page - 1) * 4,
//                 take: 4
//             }),
//     },
// };
