"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

// 타입 정의
interface SignupFormData {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
}

interface SignupRequestBody {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

const MODAL_MESSAGES = {
  PASSWORD_NOT_MATCH: "비밀번호가 일치하지 않습니다.",
  EMAIL_ALREADY_USED: "사용 중인 이메일입니다.",
  SIGNUP_SUCCESS: "가입 완료되었습니다.",
} as const;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
  } = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const isFormValid =
    isValid &&
    watch("email") &&
    watch("nickname") &&
    watch("password") &&
    watch("passwordConfirm");

  const signupMutation = useMutation({
    mutationFn: async ({
      email,
      nickname,
      password,
    }: SignupRequestBody): Promise<SignupResponse> => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nickname, password }),
      });

      const text = await response.text();
      console.log("SIGNUP RAW RESPONSE:", text);

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("서버에서 JSON이 아니라 다른 응답이 왔습니다.");
      }

      if (!response.ok) {
        if (data.message === "이미 사용 중인 이메일입니다.") {
          throw new Error(MODAL_MESSAGES.EMAIL_ALREADY_USED);
        }
        throw new Error(data.message || "회원가입에 실패했습니다.");
      }

      return data as SignupResponse;
    },

    onSuccess: (data: SignupResponse) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
      }

      setModalMessage(MODAL_MESSAGES.SIGNUP_SUCCESS);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        router.push("/market");
      }, 1500);
    },

    onError: (error: Error) => {
      setModalMessage(error.message);
      setShowModal(true);
    },
  });

  const onSubmit = (): void => {
    const { password, passwordConfirm } = getValues();

    if (password !== passwordConfirm) {
      setModalMessage(MODAL_MESSAGES.PASSWORD_NOT_MATCH);
      setShowModal(true);
      return;
    }

    signupMutation.mutate({
      email: getValues("email"),
      nickname: getValues("nickname"),
      password: getValues("password"),
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === "Enter" && isFormValid) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="page-container">
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-9999">
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

      <nav className="header-nav">
        <div className="nav-container">
          <Link href="/" className="brand-logo">
            <Image
              src="/images/pandalogo.png"
              alt="logo"
              width={120}
              height={40}
            />
          </Link>

          <div className="nav-menu-group">
            <Link href="/board" className="board-link">
              자유게시판
            </Link>
            <Link href="/market" className="market-link">
              중고마켓
            </Link>
          </div>

          <div className="nav-right">
            <Link href="/login" className="login-button">
              로그인
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content center-container">
        <div className="form-container">
          <div className="form-logo">
            <Image
              src="/images/pandalogo.png"
              alt="logo"
              width={120}
              height={40}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className="input-group">
              <label className="input-label">이메일</label>
              <input
                type="email"
                className={`text-input ${errors.email ? "error" : ""}`}
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
            </div>

            <div className="input-group">
              <label className="input-label">닉네임</label>
              <input
                type="text"
                className={`text-input ${errors.nickname ? "error" : ""}`}
                placeholder="닉네임을 입력해주세요"
                {...register("nickname", {
                  required: "닉네임을 입력해주세요.",
                })}
              />
              {errors.nickname && (
                <div className="error-message">{errors.nickname.message}</div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`text-input pr-10 ${
                    errors.password ? "error" : ""
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
                    width={20}
                    height={20}
                    alt="toggle"
                  />
                </button>
              </div>
              {errors.password && (
                <div className="error-message">{errors.password.message}</div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">비밀번호 확인</label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  className={`text-input pr-10 ${
                    errors.passwordConfirm ? "error" : ""
                  }`}
                  placeholder="비밀번호를 다시 입력해주세요"
                  {...register("passwordConfirm", { required: true })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center justify-center"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  <Image
                    src={
                      showPasswordConfirm
                        ? "/images/closeeye.png"
                        : "/images/openeye.png"
                    }
                    width={20}
                    height={20}
                    alt="toggle"
                  />
                </button>
              </div>
              {errors.passwordConfirm && (
                <div className="error-message">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`submit-button ${isFormValid ? "active" : ""}`}
              disabled={!isFormValid || signupMutation.isPending}
            >
              {signupMutation.isPending ? "회원가입 중..." : "회원가입"}
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
            이미 회원이신가요? <Link href="/login">로그인</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
