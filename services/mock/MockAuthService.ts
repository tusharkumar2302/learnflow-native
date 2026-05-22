import { AuthResult, IAuthService, UserProfile } from "@/services/interfaces/IAuthService";
import { mockAuthToken, mockUser } from "./data/user";

export class MockAuthService implements IAuthService {
  async requestOTP(_email: string): Promise<void> {
    // Mock: OTP is always "000000" — no real email sent
  }

  async verifyOTP(_email: string, _otp: string): Promise<AuthResult> {
    return { token: mockAuthToken, user: mockUser };
  }

  async getProfile(): Promise<UserProfile> {
    return mockUser;
  }

  async signOut(): Promise<void> {
    // Mock: no-op
  }
}
