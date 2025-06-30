import { ApiError, createApiClient } from "../utils/axios";
import { OTP } from "./providers/otp";
import { CustomerSession } from "./types";

class Auth {
  private apiClient: ReturnType<typeof createApiClient>;
  public otp: OTP;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
    this.otp = new OTP(this.apiClient);
  }

  async retrieveSession(id: string): Promise<CustomerSession | null> {
    const data: CustomerSession | ApiError = await this.apiClient.get(
      `/auth/session/${id}`
    );

    if (("isError" in data && data.isError) || !data || !("token" in data)) {
      console.error(`Customer session with id ${id} not found`);
      return null;
    }

    return data;
  }
}

export default Auth;
