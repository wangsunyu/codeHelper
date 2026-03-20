import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  async function onSubmit(data: RegisterForm) {
    setError('');
    try {
      await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      const res = await authService.login({ email: data.email, password: data.password });
      setUser(res.data.data);
      navigate('/');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || '注册失败，请重试');
    }
  }

  return (
    <div className="rounded-[28px] border border-border bg-white px-8 py-8 shadow-[0_18px_42px_rgba(77,69,54,0.07)]">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-[8px] bg-[#eef5ef]" />
        <span className="text-[18px] font-medium font-ui text-text-primary">AI 资源平台</span>
      </div>

      <div className="mt-6">
        <h2 className="text-[36px] leading-[1.25] font-medium font-display text-text-primary">创建账号</h2>
        <p className="mt-3 text-[16px] leading-[1.8] font-ui text-text-secondary">
          创建账号后即可上传与管理资源。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">用户名</label>
          <input
            type="text"
            placeholder="设置你的公开昵称"
            className={`h-[54px] w-full rounded-[14px] border px-4 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
              errors.username ? 'border-red-400 bg-[#fff7f6]' : 'border-[#d9deec] bg-[#fbfcff]'
            }`}
            {...register('username', {
              required: '请输入用户名',
              minLength: { value: 2, message: '用户名至少 2 个字符' },
            })}
          />
          {errors.username ? <p className="mt-2 text-[13px] font-ui text-red-500">{errors.username.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">邮箱</label>
          <input
            type="email"
            placeholder="用于登录与通知"
            className={`h-[54px] w-full rounded-[14px] border px-4 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
              errors.email ? 'border-red-400 bg-[#fff7f6]' : 'border-[#d9deec] bg-[#fbfcff]'
            }`}
            {...register('email', {
              required: '请输入邮箱',
              pattern: { value: /\S+@\S+\.\S+/, message: '邮箱格式不正确' },
            })}
          />
          {errors.email ? <p className="mt-2 text-[13px] font-ui text-red-500">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">密码</label>
          <input
            type="password"
            placeholder="至少 8 位字符"
            className={`h-[54px] w-full rounded-[14px] border px-4 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
              errors.password ? 'border-red-400 bg-[#fff7f6]' : 'border-[#d9deec] bg-[#fbfcff]'
            }`}
            {...register('password', {
              required: '请输入密码',
              minLength: { value: 6, message: '密码至少 6 位' },
            })}
          />
          {errors.password ? <p className="mt-2 text-[13px] font-ui text-red-500">{errors.password.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">确认密码</label>
          <input
            type="password"
            placeholder="再次输入密码"
            className={`h-[54px] w-full rounded-[14px] border px-4 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
              errors.confirmPassword ? 'border-red-400 bg-[#fff7f6]' : 'border-[#d9deec] bg-[#fbfcff]'
            }`}
            {...register('confirmPassword', {
              required: '请确认密码',
              validate: value => value === watch('password') || '两次密码不一致',
            })}
          />
          {errors.confirmPassword ? (
            <p className="mt-2 text-[13px] font-ui text-red-500">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        {error ? (
          <p className="rounded-[14px] bg-[#fff2f0] px-4 py-3 text-[14px] font-ui text-[#d45d5d]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-[54px] w-full items-center justify-center rounded-[14px] bg-[#161d2c] px-6 text-[16px] font-medium font-ui text-white transition-opacity hover:opacity-92 disabled:opacity-60"
        >
          {isSubmitting ? '注册中...' : '立即注册'}
        </button>
      </form>

      <p className="mt-5 text-[15px] font-medium font-ui text-text-secondary">
        已有账号？
        <Link to="/login" className="ml-1 text-text-primary hover:underline">
          去登录
        </Link>
      </p>
    </div>
  );
}
