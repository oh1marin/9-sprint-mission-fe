"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductProvider, useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

export default function RegistrationPage() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <RegistrationInner />
      </div>
    </ProductProvider>
  );
}

function RegistrationInner() {
  const router = useRouter();
  const { createProduct } = useProducts();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    tags: [],
  });

  const [errors, setErrors] = useState({
    productName: "",
    description: "",
    price: "",
    tag: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const validateProductName = (value) => {
    if (!value || value.length === 0) return "상품명을 입력해주세요";
    if (value.length > 10) return "상품명은 10자 이내로 입력해주세요";
    return "";
  };

  const validateDescription = (value) => {
    if (!value || value.length === 0) return "상품 소개를 입력해주세요";
    if (value.length < 10) return "상품 소개는 10자 이상 입력해주세요";
    if (value.length > 100) return "상품 소개는 100자 이내로 입력해주세요";
    return "";
  };

  const validatePrice = (value) => {
    if (!value) return "판매 가격을 입력해주세요";
    if (isNaN(value) || Number(value) <= 0) return "올바른 가격을 입력해주세요";
    return "";
  };

  const validateTag = (value) => {
    if (value.length > 5) return "태그는 5글자 이내로 입력해주세요";
    return "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    let error = "";
    if (id === "productName") error = validateProductName(value);
    else if (id === "description") error = validateDescription(value);
    else if (id === "price") error = validatePrice(value);

    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    const error = validateTag(value);
    setErrors((prev) => ({ ...prev, tag: error }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim();

      if (value && value.length <= 5) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
        }));
        setTagInput("");
        setErrors((prev) => ({ ...prev, tag: "" }));
      }
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const isFormValid = () => {
    return (
      formData.productName.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.price !== "" &&
      !errors.productName &&
      !errors.description &&
      !errors.price &&
      formData.productName.length >= 1 &&
      formData.productName.length <= 10 &&
      formData.description.length >= 10 &&
      formData.description.length <= 100 &&
      !isNaN(formData.price) &&
      Number(formData.price) > 0
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      await createProduct({
        name: formData.productName,
        description: formData.description,
        price: Number(formData.price),
        tags: formData.tags,
        images: images.map((img) => img.file),
      });

      alert("상품이 등록되었습니다!");
      router.push("/market");
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">상품 등록하기</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 이미지
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-sm text-gray-400 cursor-pointer hover:bg-gray-100">
              <span className="text-2xl mb-1">+</span>
              <span>이미지 등록</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0"
              >
                <img
                  src={image.preview}
                  alt={`상품 이미지 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="상품명을 입력해주세요"
            className={`w-full px-4 py-3 border ${
              errors.productName ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
          />
          {errors.productName && (
            <div className="text-red-500 text-xs mt-1">
              {errors.productName}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 소개 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="상품 소개를 입력해주세요"
            rows={5}
            className={`w-full px-4 py-3 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none`}
          />
          {errors.description && (
            <div className="text-red-500 text-xs mt-1">
              {errors.description}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            판매 가격 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="판매 가격을 입력해주세요"
            className={`w-full px-4 py-3 border ${
              errors.price ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
          />
          {errors.price && (
            <div className="text-red-500 text-xs mt-1">{errors.price}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyPress={handleTagKeyPress}
            placeholder="태그를 입력"
            className={`w-full px-4 py-3 border ${
              errors.tag ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
          />
          {errors.tag && (
            <div className="text-red-500 text-xs mt-1">{errors.tag}</div>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm gap-2 hover:bg-gray-300 transition-colors"
              >
                #{tag}
                <span
                  onClick={() => removeTag(index)}
                  className="cursor-pointer text-gray-600 hover:text-gray-900 font-semibold"
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`w-full py-4 rounded-lg text-base font-semibold flex justify-center items-center transition-all ${
            isFormValid()
              ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          등록
        </button>
      </div>
    </main>
  );
}
