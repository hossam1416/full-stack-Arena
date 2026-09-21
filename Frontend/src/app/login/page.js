"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const fields = [
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
      autoComplete: "current-password",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      login(data.token, data.user);

      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Welcome Back"
      subtitle="Log in to enter the arena"
      fields={fields}
      formData={formData}
      errors={errors}
      serverError={serverError}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitText="Log In"
      loading={loading}
      forgotPassword
      bottomText="Don't have an account?"
      bottomLinkText="Sign Up"
      bottomLinkHref="/register"
    />
  );
}
