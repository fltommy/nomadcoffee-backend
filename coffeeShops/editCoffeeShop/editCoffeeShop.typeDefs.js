import { gql } from "apollo-server";

export default gql`
    
    type editCoffeeShopResult {
        ok: Boolean!
        error: String
    }
    type Mutation {
        editCoffeeShop(
            shopName: String!
            newShopName: String
            latitude: String
            longitude: String
            url: Upload            
        ): editCoffeeShopResult!
    }
`;