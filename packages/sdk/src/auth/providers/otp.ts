import { createApiClient } from "../../utils/axios";
import {
  OTPLoginParams,
  OTPLoginResponse,
  OTPSignupParams,
  OTPSignupResponse,
  OTPVerifyParams,
  OTPVerifyResponse,
} from "../types";

export class OTP {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiClient: ReturnType<typeof createApiClient>) {
    this.apiClient = apiClient;
  }

  async signup(params: OTPSignupParams): Promise<OTPSignupResponse> {
    const data: OTPSignupResponse = await this.apiClient.post(
      "/auth/otp/signup",
      params
    );

    return data;
  }

  async login(params: OTPLoginParams): Promise<OTPLoginResponse> {
    const data: OTPLoginResponse = await this.apiClient.post(
      "/auth/otp/login",
      params
    );

    return data;
  }

  async verify(params: OTPVerifyParams): Promise<OTPVerifyResponse> {
    const data: OTPVerifyResponse = await this.apiClient.post(
      "/auth/otp/verify",
      params
    );

    return data;
  }
}
