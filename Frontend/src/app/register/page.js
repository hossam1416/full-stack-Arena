"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      autoComplete: "username",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "new-password",
      helperText: "Must be at least 6 characters",
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      login(data.token, data.user);

      router.push("/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create Your Account"
      subtitle="Start building your team and competing today"
      fields={fields}
      formData={formData}
      errors={errors}
      serverError={serverError}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitText="Sign Up"
      loading={loading}
      bottomText="Already have an account?"
      bottomLinkText="Log In"
      bottomLinkHref="/login"
    />
  );
}
