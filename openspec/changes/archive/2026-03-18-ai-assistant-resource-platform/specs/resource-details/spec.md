## ADDED Requirements

### Requirement: Display resource details
系统必须为每个MCP和Skills资源提供详细信息页面。

#### Scenario: View MCP details
- **WHEN** 用户访问某个MCP资源的详情页面
- **THEN** 系统显示资源的完整介绍、使用说明、版本信息、作者信息和下载统计

#### Scenario: View Skills details
- **WHEN** 用户访问某个Skills资源的详情页面
- **THEN** 系统显示资源的完整介绍、使用说明、版本信息、作者信息和下载统计

### Requirement: Resource metadata
系统必须存储和显示资源的元数据信息。

#### Scenario: Display metadata
- **WHEN** 用户查看资源详情
- **THEN** 系统显示资源名称、描述、版本号、上传时间、更新时间、作者、下载次数

### Requirement: Version history
系统必须记录和显示资源的版本历史。

#### Scenario: View version history
- **WHEN** 用户查看资源的版本历史
- **THEN** 系统显示所有历史版本及其更新说明

#### Scenario: Download specific version
- **WHEN** 用户选择下载特定历史版本
- **THEN** 系统提供该版本的下载
