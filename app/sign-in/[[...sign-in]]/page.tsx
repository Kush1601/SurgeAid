import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fefbf3' }}>
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-6">
          Coordinator access only — sign in to report emergencies
        </p>
        <SignIn />
      </div>
    </div>
  );
}
