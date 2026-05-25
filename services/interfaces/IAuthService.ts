export interface UserProfile {
  id: string;
  name: string;
  email: string;
  imgUrl: string | null;
  subscriptionTier: "FREE" | "ZUPER_CENT" | "ZUPER_PRO" | "ZUPER_VINTAGE";
  streak: number;
  joinedAt: string;
}

export interface AuthResult {
  token: string;
  user: UserProfile;
}

export interface IAuthService {
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(name: string, email: string, password: string): Promise<void>;
  requestOTP(email: string): Promise<void>;
  verifyOTP(email: string, otp: string): Promise<AuthResult>;
  getProfile(): Promise<UserProfile>;
  signOut(): Promise<void>;
}
