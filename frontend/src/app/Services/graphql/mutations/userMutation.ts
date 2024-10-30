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
    $name: String,
    $profilePic: Upload,
    $pinCode: String,
    $city: String,
  ) {
    updateUser(
      name: $name,
      profilePic: $profilePic,
      pinCode: $pinCode,
      city: $city,
    ) {
      success
      message
    }
  }
`;
// Send OTP Mutation
export const SEND_OTP_MUTATION = gql`
  mutation CheckOtp {
    checkotp {
      success
      message
    }
  }
`;

// Verify OTP Mutation
export const VERIFY_OTP_MUTATION = gql`
  mutation ConfirmOtp($otp: String!) {
    confirmOtp(otp: $otp) {
      success
      message
      token
    }
  }
`;

// Change Password Mutation
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($token: String!, $newPassword: String!) {
    changePassword(token: $token, newPassword: $newPassword) {
      success
      message
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

