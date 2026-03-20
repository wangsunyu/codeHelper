import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

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
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold font-display text-text-primary tracking-tight">欢迎回来</h2>
        <p className="text-sm text-text-secondary font-ui mt-1">登录你的账号继续使用</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="邮箱"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email', { required: '请输入邮箱', pattern: { value: /\S+@\S+\.\S+/, message: '邮箱格式不正确' } })}
        />
        <Input
          label="密码"
          type="password"
          placeholder="请输入密码"
          error={errors.password?.message}
          {...register('password', { required: '请输入密码' })}
        />
        {error && <p className="text-sm text-red-500 font-ui">{error}</p>}
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
          登录
        </Button>
      </form>

      <p className="text-sm text-text-secondary font-ui text-center">
        还没有账号？{' '}
        <Link to="/register" className="text-text-primary font-medium hover:underline">立即注册</Link>
      </p>
    </div>
  );
}
