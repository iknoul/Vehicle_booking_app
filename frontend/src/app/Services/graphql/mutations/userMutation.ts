import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`

  mutation CreateUser(

    $name: String!, 
    $email: String!, 
    $mobile: String!, 
    $password: String!, 
    $profilePic: Upload!
    $token: String
  ) {
    createUser(
      name: $name,  
      email: $email, 
      mobile: $mobile, 
      password: $password, 
      profilePic: $profilePic
      token: $token
    ) {
      id
      name
    }
  }
`;


// email
// mobile
// profilePic

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $id: ID!,
    $name: String,
    $email: String,
    $mobile: String,
    $profilePic: [String]
  ) {
    updateUser(
      id: $id,
      name: $name,
      email: $email,
      mobile: $mobile,
      profilePic: $profilePic
    ) {
      id
      name
      email
      mobile
      profilePic
    }
  }
`;

export const LOCK_PERIOD_MUTATION = gql`
  mutation LockPeriod($startDate: String!, $endDate: String!, $vehicleId: String!) {
    lockPeriod(startDate: $startDate, endDate: $endDate, vehicleId: $vehicleId) {
      available
      lockId
      amount
    }
  }
`;

