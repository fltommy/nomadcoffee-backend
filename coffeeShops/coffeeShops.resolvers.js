import client from "../client";

export default {
    Category: {
        totalShops: ({id}) => client.category.count({
            where: {
                shops: {
                    some: {
                        id,
                    },
                },
            },
        })
    }
};