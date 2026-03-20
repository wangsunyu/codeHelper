import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  async function onSubmit(data: LoginForm) {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || '登录失败，请重试');
    }
  }

  return (
    <div className="rounded-[26px] border border-border bg-white px-8 py-8 shadow-[0_16px_40px_rgba(77,69,54,0.06)]">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-[6px] bg-primary" />
        <span className="text-[18px] font-medium font-ui text-text-primary">AI助手资源平台</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">邮箱</label>
          <input
            type="email"
            placeholder="hello@example.com"
            className={`h-[54px] w-full rounded-[16px] bg-bg-surface px-5 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
              errors.email ? 'border border-red-400' : 'border border-transparent'
            }`}
            {...register('email', {
              required: '请输入邮箱',
              pattern: { value: /\S+@\S+\.\S+/, message: '邮箱格式不正确' },
            })}
          />
          {errors.email ? (
            <p className="mt-2 text-[13px] font-ui text-red-500">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">密码</label>
          <input
            type="password"
            placeholder="请输入密码"
            className={`h-[54px] w-full rounded-[16px] bg-bg-surface px-5 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
              errors.password ? 'border border-red-400' : 'border border-transparent'
            }`}
            {...register('password', { required: '请输入密码' })}
          />
          {errors.password ? (
            <p className="mt-2 text-[13px] font-ui text-red-500">{errors.password.message}</p>
          ) : null}
        </div>

        <p className="pt-1 text-center text-[14px] font-medium font-ui text-text-secondary">
          还没有账号？
          <Link to="/register" className="ml-1 text-primary hover:underline">
            立即注册
          </Link>
        </p>

        <div className="pt-1">
          <h2 className="text-[34px] leading-[1.25] font-medium font-display text-text-primary">登录</h2>
          <p className="mt-3 text-[16px] leading-[1.8] font-ui text-text-secondary">
            继续访问你收藏的 Skills 与已安装配置。
          </p>
        </div>

        {error ? (
          <p className="rounded-[14px] bg-[#fff2f0] px-4 py-3 text-[14px] font-ui text-[#d45d5d]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-[54px] w-full items-center justify-center rounded-btn bg-primary px-6 text-[16px] font-medium font-ui text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}
