import { UserProfile } from "@/services/interfaces/IAuthService";

export const mockUser: UserProfile = {
  id: "user-demo-001",
  name: "Arjun Sharma",
  email: "arjun@demo.com",
  imgUrl: null,
  subscriptionTier: "ZUPER_PRO",
  streak: 7,
  joinedAt: "2025-10-14T00:00:00Z",
};

export const mockAuthToken = "mock-token-demo-session-001";
