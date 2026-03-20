import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useState } from 'react';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  async function onSubmit(data: RegisterForm) {
    setError('');
    try {
      await authService.register({ username: data.username, email: data.email, password: data.password });
      const res = await authService.login({ email: data.email, password: data.password });
      setUser(res.data.data);
      navigate('/');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || '注册失败，请重试');
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold font-display text-text-primary tracking-tight">创建账号</h2>
        <p className="text-sm text-text-secondary font-ui mt-1">加入 AISkills 社区</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="用户名"
          placeholder="你的昵称"
          error={errors.username?.message}
          {...register('username', { required: '请输入用户名', minLength: { value: 2, message: '用户名至少 2 个字符' } })}
        />
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
          placeholder="至少 6 位"
          error={errors.password?.message}
          {...register('password', { required: '请输入密码', minLength: { value: 6, message: '密码至少 6 位' } })}
        />
        <Input
          label="确认密码"
          type="password"
          placeholder="再次输入密码"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: '请确认密码',
            validate: v => v === watch('password') || '两次密码不一致',
          })}
        />
        {error && <p className="text-sm text-red-500 font-ui">{error}</p>}
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
          注册
        </Button>
      </form>

      <p className="text-sm text-text-secondary font-ui text-center">
        已有账号？{' '}
        <Link to="/login" className="text-text-primary font-medium hover:underline">立即登录</Link>
      </p>
    </div>
  );
}
