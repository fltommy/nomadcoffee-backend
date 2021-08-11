import client from "../../client";

export default {
    Mutation: {
        seeCategories: async (_,{lastId}) => {
            const categories = await client.category.findMany({
                take: 5,
                skip: lastId ? 1 : 0,
                ...(lastId &&  { cursor: { id: lastId } })
            });
            const totalShops = await client.coffeeShop.count({
                take: 5,
                skip: lastId ? 1 : 0,
                ...(lastId &&  { cursor: { id: lastId } })
            });
            return {
                ...(categories&&{categories}),
                ...(totalShops&&{totalShops}),
            };
        }
    }
}