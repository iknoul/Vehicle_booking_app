import { gql } from "@apollo/client";

export const FETCH_PERIODS_QUERY = gql`
    query GetPeriodsByUser {
        periodsByUser {
            id
            status
            startDate
            endDate
            vehicleType
            vehicleModelName
            vehicleManufacture
            uniqueVehicle {
                id
                vehicle {
                    name
                }
            }
        }
    }
`;
export const FETCH_PERIOD_BY_DATE_QUERY = gql`
  query PeroidByDate {
    PeroidByDate {
      createdDate
      PeriodCount
      carModel
    }
  }
`;
