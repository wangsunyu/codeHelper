import * as SkillModel from '../models/skill.model';
import { getRankings } from './ranking.service';

export async function getHomeData() {
  const [hotSkills, rankings, stats] = await Promise.all([
    SkillModel.findAll({ sort: 'download_count', page: 1, limit: 8 }),
    getRankings('all', 5),
    SkillModel.getStats(),
  ]);
  return { hotSkills: hotSkills.rows, rankings, stats };
}
