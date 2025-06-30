import { Address, CustomerCreateParams } from "../types";

export interface CustomerSession {
  customerId: string;
  expiresAt: Date;
  testmode: boolean;
  token: string;

  customer: {
    createdAt: Date;
    updatedAt: Date;

    firstName: string;
    lastName: string;
    email: string;
    phone?: string;

    password?: string;
    image?: string;
    metadata?: string;

    stripeCustomerId: string;
    isSubscribedEmail: boolean;
    isSubscribedSMS: boolean;

    address: Address;
  };
}

export interface OTPLoginParams {
  email: string;
}

export interface OTPSignupParams extends CustomerCreateParams {}

export interface OTPVerifyParams {
  email: string;
  otp: string;
}

export type OTPLoginResponse =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      code: "BAD_REQUEST" | "CUSTOMER_NOT_FOUND";
      error: string;
    };

export type OTPSignupResponse =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      code: "BAD_REQUEST" | "CUSTOMER_ALREADY_EXISTS";
      error: string;
    };

export type OTPVerifyResponse =
  | {
      success: true;
      customerSession: CustomerSession;
    }
  | {
      success: false;
      code: "BAD_REQUEST";
      error: string;
    };
