  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = document.getElementById("senha");

  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
  });