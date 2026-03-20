import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { skillService } from '../services/skill';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { formatFileSize } from '../utils/format';

const ALLOWED_EXTS = ['.json', '.yaml', '.yml', '.zip', '.md'];
const CATEGORY_OPTIONS = [
  { value: 'productivity', label: '效率' },
  { value: 'coding', label: '编程' },
  { value: 'writing', label: '写作' },
  { value: 'other', label: '其他' },
];

interface PublishForm {
  title: string;
  category: string;
  description: string;
}

export function SkillPublishPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PublishForm>({
    defaultValues: { category: 'productivity' },
  });

  function handleFile(f: File) {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setFileError(`不支持的文件类型，仅允许：${ALLOWED_EXTS.join(', ')}`);
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setFileError('文件大小不能超过 50MB');
      return;
    }
    setFileError('');
    setFile(f);
  }

  async function onSubmit(data: PublishForm) {
    if (!file) { setFileError('请上传文件'); return; }
    setSubmitError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', data.title);
      fd.append('category', data.category);
      fd.append('description', data.description);
      const res = await skillService.publish(fd);
      navigate(`/skills/${res.data.data.id}`);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setSubmitError(msg || '发布失败，请重试');
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold font-display text-text-primary tracking-tight">发布 Skill</h1>
        <p className="text-sm text-text-secondary font-ui mt-1">分享你的 AI 技能配置给社区</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* 上传区 */}
          <div>
            <label className="text-sm font-medium text-text-primary font-ui block mb-1.5">上传文件</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className={`border-2 border-dashed rounded-card p-10 text-center cursor-pointer transition-colors
                ${dragOver ? 'border-primary bg-primary-tint' : 'border-border hover:border-primary hover:bg-primary-tint'}`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📄</span>
                  <p className="text-sm font-medium font-ui text-text-primary">{file.name}</p>
                  <p className="text-xs text-text-secondary font-ui">{formatFileSize(file.size)}</p>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-red-400 hover:text-red-500 font-ui mt-1">移除</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl text-text-muted">↑</span>
                  <p className="text-sm font-medium font-ui text-text-primary">拖拽文件到此处，或点击上传</p>
                  <p className="text-xs text-text-secondary font-ui">支持 {ALLOWED_EXTS.join(', ')}，最大 50MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" className="hidden"
              accept={ALLOWED_EXTS.join(',')}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {fileError && <p className="text-xs text-red-500 font-ui mt-1">{fileError}</p>}
          </div>

          <Input
            label="标题"
            placeholder="给你的 Skill 起个名字"
            error={errors.title?.message}
            {...register('title', { required: '请输入标题' })}
          />
          <Select
            label="分类"
            options={CATEGORY_OPTIONS}
            {...register('category', { required: true })}
          />
          <Textarea
            label="描述"
            placeholder="介绍一下这个 Skill 的用途和使用方法..."
            rows={5}
            {...register('description')}
          />

          {submitError && <p className="text-sm text-red-500 font-ui">{submitError}</p>}
          <Button type="submit" size="lg" loading={isSubmitting}>发布</Button>
        </form>
      </div>
    </div>
  );
}
