import { gql } from "@apollo/client";

export const FETCH_PERIODS_QUERY = gql`
    query GetPeriodsByUser {
        periodsByUser {
            id
            status
            startDate
            endDate
            uniqueVehicle {
                id
                vehicle {
                    name
                    model
                    manufacture
                }
            }
        }
    }
`;