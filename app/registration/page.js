'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';

export default function RegistrationPage() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    tags: []
  });

  const [errors, setErrors] = useState({
    productName: '',
    description: '',
    price: '',
    tag: ''
  });

  const [tagInput, setTagInput] = useState('');

  const validateProductName = (value) => {
    if (!value || value.length === 0) return '상품명을 입력해주세요';
    if (value.length > 10) return '상품명은 10자 이내로 입력해주세요';
    return '';
  };

  const validateDescription = (value) => {
    if (!value || value.length === 0) return '상품 소개를 입력해주세요';
    if (value.length < 10) return '상품 소개는 10자 이상 입력해주세요';
    if (value.length > 100) return '상품 소개는 100자 이내로 입력해주세요';
    return '';
  };

  const validatePrice = (value) => {
    if (!value) return '판매 가격을 입력해주세요';
    if (isNaN(value) || Number(value) <= 0) return '올바른 가격을 입력해주세요';
    return '';
  };

  const validateTag = (value) => {
    if (value.length > 5) return '태그는 5글자 이내로 입력해주세요';
    return '';
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    let error = '';
    if (id === 'productName') error = validateProductName(value);
    else if (id === 'description') error = validateDescription(value);
    else if (id === 'price') error = validatePrice(value);

    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    const error = validateTag(value);
    setErrors(prev => ({ ...prev, tag: error }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = tagInput.trim();

      if (value && value.length <= 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, value]
        }));
        setTagInput('');
        setErrors(prev => ({ ...prev, tag: '' }));
      }
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const isFormValid = () => {
    return (
      formData.productName.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.price !== '' &&
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
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      await addProduct({
        name: formData.productName,
        description: formData.description,
        price: Number(formData.price),
        tags: formData.tags
      });

      alert('상품이 등록되었습니다!');
      router.push('/market');
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-500">
              판다마켓
            </Link>
            <div className="flex gap-6">
              <Link href="/board" className="text-gray-600 hover:text-gray-900">
                자유게시판
              </Link>
              <Link href="/market" className="text-blue-500 font-semibold">
                중고마켓
              </Link>
            </div>
            <Link href="/login" className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              로그인
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">상품 등록하기</h1>

        <div className="space-y-6">
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
              className={`w-full px-4 py-3 border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
            />
            {errors.productName && (
              <div className="text-red-500 text-xs mt-1">{errors.productName}</div>
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
              className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none`}
            />
            {errors.description && (
              <div className="text-red-500 text-xs mt-1">{errors.description}</div>
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
              className={`w-full px-4 py-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
            />
            {errors.price && (
              <div className="text-red-500 text-xs mt-1">{errors.price}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyPress={handleTagKeyPress}
              placeholder="태그를 입력 후 Enter"
              className={`w-full px-4 py-3 border ${errors.tag ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
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
            className={`w-full py-4 rounded-lg text-base font-semibold transition-all ${
              isFormValid()
                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            등록
          </button>
        </div>
      </main>
    </div>
  );
}