import { syncToMySQL } from '../services/ranking.service';

// 每小时同步一次 Redis 排行榜数据到 MySQL
const INTERVAL = 60 * 60 * 1000;

async function run() {
  try {
    await syncToMySQL();
    console.log('[sync-rankings] 同步完成');
  } catch (e) {
    console.error('[sync-rankings] 同步失败', e);
  }
}

export function startSyncJob() {
  run(); // 启动时立即执行一次
  setInterval(run, INTERVAL);
}
