import { gql } from "apollo-server";

export default gql`
    type Query {
        seeCoffeeShops(lastId: String):[CoffeeShop]
    }
    
`;