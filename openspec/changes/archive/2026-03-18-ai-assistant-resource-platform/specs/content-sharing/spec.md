## ADDED Requirements

### Requirement: Publish experience article
系统必须允许用户发布AI使用心得文章。

#### Scenario: Successful publish
- **WHEN** 用户提交包含标题和内容的文章
- **THEN** 系统保存文章并在分享区显示

#### Scenario: Incomplete article
- **WHEN** 用户提交缺少标题或内容的文章
- **THEN** 系统拒绝发布并提示必填字段

### Requirement: Browse experience articles
系统必须提供文章浏览功能。

#### Scenario: List all articles
- **WHEN** 用户访问心得分享页面
- **THEN** 系统显示所有已发布的文章列表

#### Scenario: Search articles
- **WHEN** 用户输入搜索关键词
- **THEN** 系统返回匹配的文章列表

### Requirement: View article details
系统必须提供文章详情页面。

#### Scenario: Display article
- **WHEN** 用户点击某篇文章
- **THEN** 系统显示文章的完整内容、作者、发布时间

### Requirement: Manage own articles
系统必须允许用户管理自己发布的文章。

#### Scenario: Edit article
- **WHEN** 用户编辑自己的文章
- **THEN** 系统更新文章内容

#### Scenario: Delete article
- **WHEN** 用户删除自己的文章
- **THEN** 系统移除该文章

### Requirement: Article comments
系统必须支持对文章的评论功能。

#### Scenario: Comment on article
- **WHEN** 用户在文章下方发表评论
- **THEN** 系统保存评论并显示在文章评论区
