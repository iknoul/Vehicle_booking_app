import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login( 
    $mobile: String!, 
    $password: String!, 
  ) {
    login(
      mobile: $mobile, 
      password: $password, 
    ) {
      success
      message
      token 
    }
  }
`;

export const SEND_OTP_MUTATION = gql`
  mutation SendOtp($mobile: String!) {
    sendOtp(mobile: $mobile) {
      success
      message
    }
  }
`

export const VERIFY_MOBILE_MUTATION = gql`
  mutation VerifyOtp($otp: String!, $mobile: String!) {
    verifyOtp(otp: $otp, mobile:$mobile) {
      success
      token
    }
  }
`;


