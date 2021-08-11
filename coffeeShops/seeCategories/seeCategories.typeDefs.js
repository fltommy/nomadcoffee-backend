import { gql } from "apollo-server";

export default gql`
    type seeCategoriesResult {
        categories: [Category]
        totalShops: Int
    }
    type Mutation {
        seeCategories(lastId: Int): seeCategoriesResult!
    }
`;