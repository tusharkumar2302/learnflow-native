import { AuthResult, IAuthService, UserProfile } from "@/services/interfaces/IAuthService";
import { localUser, localAuthToken } from "./data/user";

export class LocalAuthService implements IAuthService {
  async signIn(_email: string, _password: string): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 700));
    return { token: localAuthToken, user: localUser };
  }

  async signUp(_name: string, _email: string, _password: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 500));
  }

  async requestOTP(_email: string): Promise<void> {}

  async verifyOTP(_email: string, _otp: string): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 600));
    return { token: localAuthToken, user: localUser };
  }

  async getProfile(): Promise<UserProfile> {
    return localUser;
  }

  async signOut(): Promise<void> {}
}
