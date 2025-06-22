const GoogleAuthButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full bg-red-500 text-white p-2 rounded"
    >
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
