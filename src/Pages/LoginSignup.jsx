const handleCaptchaVerify = async (captchaToken) => {
  if (!pendingAction) return;

  try {
    if (pendingAction.type === "login") {
      const { email, password, rememberMe } = pendingAction.data;
      const res = await axios.post(
        'https://dept-store-auth-server.vercel.app/api/auth/login',
        { email, password }
      );

      if (res.data?.token) {
        // Update context & storage
        updateToken(res.data.token, rememberMe);

        // Wait a tick to ensure token state updates before fetching cart
        setTimeout(() => {
          toast.success("Login Successfully");
          navigate('/');
        }, 50);
      }
    } else if (pendingAction.type === "signup") {
      const { email, password, username } = pendingAction.data;
      const res = await axios.post(
        'https://dept-store-auth-server.vercel.app/api/auth/register',
        { name: username, email, password }
      );

      if (res.data?.message) {
        toast.success(res.data.message);
        navigate('/login');
      }
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setPendingAction(null);
    setShowCaptcha(false);
  }
};
