## ADDED Requirements

### Requirement: Post comment
系统必须允许用户对MCP和Skills资源发表评论。

#### Scenario: Successful comment
- **WHEN** 用户在资源详情页面提交评论
- **THEN** 系统保存评论并显示在评论列表中

#### Scenario: Empty comment
- **WHEN** 用户提交空白评论
- **THEN** 系统拒绝提交并提示评论不能为空

### Requirement: View comments
系统必须显示资源的所有评论。

#### Scenario: Display comments
- **WHEN** 用户访问资源详情页面
- **THEN** 系统显示该资源的所有评论，按时间倒序排列

#### Scenario: No comments
- **WHEN** 资源尚无评论
- **THEN** 系统显示"暂无评论"提示

### Requirement: Manage own comments
系统必须允许用户管理自己的评论。

#### Scenario: Edit comment
- **WHEN** 用户编辑自己的评论
- **THEN** 系统更新评论内容并标记为已编辑

#### Scenario: Delete comment
- **WHEN** 用户删除自己的评论
- **THEN** 系统移除该评论

### Requirement: Comment moderation
系统必须支持评论的基本审核功能。

#### Scenario: Report inappropriate comment
- **WHEN** 用户举报不当评论
- **THEN** 系统记录举报并标记该评论待审核
