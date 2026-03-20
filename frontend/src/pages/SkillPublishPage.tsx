import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { skillService } from '../services/skill';

const ALLOWED_EXTS = ['.zip', '.json', '.yaml', '.yml', '.md'];
const CATEGORY_OPTIONS = [
  { value: '', label: '请选择分类' },
  { value: 'productivity', label: 'productivity' },
  { value: 'coding', label: 'coding' },
  { value: 'writing', label: 'writing' },
  { value: 'other', label: 'other' },
];

interface PublishForm {
  title: string;
  category: string;
  description: string;
}

export function SkillPublishPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublishForm>({
    defaultValues: {
      category: '',
    },
  });

  function handleFile(nextFile: File) {
    const ext = `.${nextFile.name.split('.').pop()?.toLowerCase()}`;
    if (!ALLOWED_EXTS.includes(ext)) {
      setFileError(`不支持的文件类型，仅允许：${ALLOWED_EXTS.join(' / ')}`);
      return;
    }
    if (nextFile.size > 50 * 1024 * 1024) {
      setFileError('文件大小不能超过 50MB');
      return;
    }

    setFile(nextFile);
    setFileError('');
  }

  async function onSubmit(data: PublishForm) {
    if (!file) {
      setFileError('请先选择上传文件');
      return;
    }

    setSubmitError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      const res = await skillService.publish(formData);
      navigate(`/skills/${res.data.data.id}`);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setSubmitError(msg || '提交失败，请重试');
    }
  }

  return (
    <div className="mx-auto max-w-[760px] px-5 py-8 sm:px-8 lg:px-0 lg:py-10">
      <div>
        <h1 className="text-[44px] leading-[1.25] font-medium font-display text-text-primary">
          发布你的 Skills
        </h1>
        <p className="mt-4 text-[17px] leading-[1.8] font-ui text-text-secondary">
          上传压缩包并补充信息，让社区快速理解和使用你的 AI 助手能力。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={event => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={event => {
            event.preventDefault();
            setDragOver(false);
            const droppedFile = event.dataTransfer.files?.[0];
            if (droppedFile) handleFile(droppedFile);
          }}
          className={`rounded-[24px] border bg-white px-6 py-8 text-center shadow-[0_4px_16px_rgba(77,69,54,0.03)] transition-colors ${
            dragOver ? 'border-primary bg-primary-tint' : 'border-border'
          }`}
        >
          <div className="mx-auto h-[46px] w-[46px] rounded-[16px] bg-bg-surface" />
          <p className="mt-6 text-[18px] font-medium font-ui text-text-primary">
            {file ? file.name : '拖拽文件到这里，或点击选择上传'}
          </p>
          <p className="mt-4 text-[15px] leading-[1.8] font-ui text-text-secondary">
            支持 ZIP / JSON / MCP 配置包，建议附带 README 和使用说明。
          </p>
          {fileError ? (
            <p className="mt-4 text-[14px] font-ui text-red-500">{fileError}</p>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_EXTS.join(',')}
            onChange={event => {
              const selectedFile = event.target.files?.[0];
              if (selectedFile) handleFile(selectedFile);
            }}
          />
        </div>

        <div className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_4px_16px_rgba(77,69,54,0.03)]">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">标题</label>
              <input
                type="text"
                placeholder="例如：PR Review Copilot"
                className={`h-[54px] w-full rounded-[16px] bg-bg-surface px-5 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
                  errors.title ? 'border border-red-400' : 'border border-transparent'
                }`}
                {...register('title', { required: '请输入标题' })}
              />
              {errors.title ? <p className="mt-2 text-[13px] font-ui text-red-500">{errors.title.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">分类</label>
              <div className="relative">
                <select
                  className={`h-[54px] w-full appearance-none rounded-[16px] bg-bg-surface px-5 text-[15px] font-ui text-text-primary outline-none ${
                    errors.category ? 'border border-red-400' : 'border border-transparent'
                  }`}
                  {...register('category', { required: '请选择分类' })}
                >
                  {CATEGORY_OPTIONS.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary">∨</span>
              </div>
              {errors.category ? <p className="mt-2 text-[13px] font-ui text-red-500">{errors.category.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-medium font-ui text-text-primary">描述</label>
              <textarea
                rows={6}
                placeholder="介绍这个 Skills 的核心能力、适用场景、安装方式和注意事项。"
                className={`w-full resize-none rounded-[16px] bg-bg-surface px-5 py-4 text-[15px] font-ui text-text-primary outline-none placeholder:text-text-muted ${
                  errors.description ? 'border border-red-400' : 'border border-transparent'
                }`}
                {...register('description')}
              />
            </div>

            {submitError ? (
              <p className="rounded-[14px] bg-[#fff2f0] px-4 py-3 text-[14px] font-ui text-[#d45d5d]">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-[54px] w-full items-center justify-center rounded-btn bg-primary px-6 text-[16px] font-medium font-ui text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? '提交中...' : '提交发布'}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-col gap-2 rounded-[18px] bg-bg-surface px-5 py-4 text-[14px] font-ui text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <span>支持格式：ZIP / JSON / MCP 包</span>
        <span>单文件限制：50MB</span>
      </div>
    </div>
  );
}
