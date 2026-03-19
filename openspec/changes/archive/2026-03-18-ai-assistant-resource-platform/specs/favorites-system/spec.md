## ADDED Requirements

### Requirement: Add to favorites
系统必须允许已登录用户收藏MCP和Skills资源。

#### Scenario: Successful favorite
- **WHEN** 已登录用户点击收藏按钮
- **THEN** 系统将资源添加到用户的收藏列表

#### Scenario: Unauthorized favorite
- **WHEN** 未登录用户尝试收藏资源
- **THEN** 系统要求用户先登录

#### Scenario: Already favorited
- **WHEN** 用户尝试收藏已收藏的资源
- **THEN** 系统提示该资源已在收藏列表中

### Requirement: Remove from favorites
系统必须允许用户取消收藏资源。

#### Scenario: Successful unfavorite
- **WHEN** 用户点击取消收藏按钮
- **THEN** 系统从用户的收藏列表中移除该资源

### Requirement: View favorites list
系统必须提供用户收藏列表页面。

#### Scenario: Display favorites
- **WHEN** 已登录用户访问收藏列表页面
- **THEN** 系统显示用户收藏的所有资源

#### Scenario: Empty favorites
- **WHEN** 用户尚未收藏任何资源
- **THEN** 系统显示"暂无收藏"提示

### Requirement: Favorite count
系统必须显示每个资源的收藏数量。

#### Scenario: Display favorite count
- **WHEN** 用户查看资源信息
- **THEN** 系统显示该资源被收藏的总次数
