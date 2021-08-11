import { gql } from "apollo-server";

export default gql`
    type Query {
        seeCategory(categoryName: String!, lastId: Int): [CoffeeShop]
    }
`;