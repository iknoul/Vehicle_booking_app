export interface UserDataType{
    name: string;
    address: object;
    pinCode: string;
    city: string;
    profilePic: File; // Specify the type correctly
    mobile?: string;
    email?: string;
    password?: string;
}