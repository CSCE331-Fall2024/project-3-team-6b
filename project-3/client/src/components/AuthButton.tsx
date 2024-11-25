export default function AuthButton() {
  const handleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
}
