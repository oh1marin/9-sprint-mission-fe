"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

interface LoginFormData {
  email: string;
  password: string;
}

interface ApiErrors {
  email: string;
  password: string;
}

const MODAL_MESSAGES = {
  INVALID_CREDENTIALS: "이메일 또는 비밀번호를 확인해 주세요.",
  LOGIN_FAILED: "로그인에 실패했습니다.",
  LOGIN_SUCCESS: "로그인에 성공했습니다.",
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiErrors, setApiErrors] = useState<ApiErrors>({
    email: "",
    password: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, isLoggingIn } = useAuth();

  const onSubmit = (data: LoginFormData): void => {
    setApiErrors({ email: "", password: "" });
    login(data.email, data.password);
  };

  const formValues = watch();
  const isFormValid = isValid && !!formValues.email && !!formValues.password;

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === "Enter" && isFormValid) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <Header />

      <div className="page-container">
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
            <div className="w-[540px] h-[250px] bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center justify-between text-center">
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-[20px] text-gray-800">{modalMessage}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-44 h-12 flex items-center justify-center rounded-xl bg-[#2f80ed] text-white text-[18px] hover:bg-[#256ee8] transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        )}

        <main className="main-content center-container">
          <div className="form-container">
            <div className="form-logo">
              <Image
                src="/images/pandalogo.png"
                alt="logo"
                width={120}
                height={40}
                priority
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  className={`text-input ${
                    errors.email || apiErrors.email ? "error" : ""
                  }`}
                  placeholder="이메일을 입력해주세요"
                  {...register("email", {
                    required: "이메일을 입력해주세요.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "잘못된 이메일 형식입니다",
                    },
                  })}
                />
                {errors.email && (
                  <div className="error-message">{errors.email.message}</div>
                )}
                {!errors.email && apiErrors.email && (
                  <div className="error-message">{apiErrors.email}</div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`text-input pr-10 ${
                      errors.password || apiErrors.password ? "error" : ""
                    }`}
                    placeholder="비밀번호를 입력해주세요"
                    {...register("password", {
                      required: "비밀번호를 입력해주세요.",
                      minLength: {
                        value: 8,
                        message: "비밀번호를 8자 이상 입력해주세요.",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center justify-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      src={
                        showPassword
                          ? "/images/closeeye.png"
                          : "/images/openeye.png"
                      }
                      alt="toggle"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">{errors.password.message}</div>
                )}
                {!errors.password && apiErrors.password && (
                  <div className="error-message">{apiErrors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className={`submit-button ${isFormValid ? "active" : ""}`}
                disabled={!isFormValid || isLoggingIn}
              >
                {isLoggingIn ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <div className="social-login-bar">
              <span className="social-login-text">간편 로그인하기</span>
              <div className="social-icons-container">
                <a
                  className="social-icon-link google"
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                </a>

                <a
                  className="social-icon-link kakao"
                  href="https://www.kakaocorp.com/page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/kakao.png"
                    alt="Kakao"
                    width={20}
                    height={20}
                  />
                </a>
              </div>
            </div>

            <div className="bottom-navigation-link">
              판다마켓이 처음이신가요? <Link href="/signup">회원가입</Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
