import { gql } from '@apollo/client';

export const FETCH_VEHICLES_QUERY = gql`
  query Vehicles($model: String, $minPrice: Float, $maxPrice: Float, $limit: Int, $startDate: String, $endDate:String, $filter: Boolean) {
    vehicles( model: $model, minPrice: $minPrice, maxPrice: $maxPrice, limit: $limit, startDate: $startDate, endDate: $endDate, filter: $filter) {
      id
      name
      model
      type
      manufacture
      description
      price
      quantity
      image
      
    }
  }
`;
// vehicleModel {
//   id
//   model
//   type
//   manufacture
// }
