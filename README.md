# C.A.T. Team 官方网站

基于 Astro 构建的 C.A.T. Team（南京理工大学学生 CTF 战队）静态官网项目。网站内容由 YAML 数据文件驱动，便于长期维护与快速更新。

## 站点信息

- 团队名称：C.A.T. Team
- 口号：Think precisely. Break elegantly.
- 官网地址：https://cat-team.online
- 主要栏目：主页、关于、成员、荣誉、历程、加入我们
- 联系方式：likaijie@njust.edu.cn

## 技术栈

- Astro 5：页面结构与静态构建
- TypeScript：类型约束与数据契约
- YAML：内容管理与数据驱动
- CSS：样式系统与响应式布局

## 项目结构

```text
.
|-- public/
|   |-- robots.txt
|   `-- images/
|       |-- brand/
|       `-- members/
|-- src/
|   |-- components/
|   |   |-- HeroSection.astro
|   |   |-- AboutSection.astro
|   |   |-- MembersSection.astro
|   |   |-- HonorsSection.astro
|   |   |-- TimelineSection.astro
|   |   `-- RecruitmentSection.astro
|   |-- data/
|   |   |-- site.yaml
|   |   |-- members.yaml
|   |   |-- honors.yaml
|   |   |-- timeline.yaml
|   |   `-- recruitment.yaml
|   |-- layouts/BaseLayout.astro
|   |-- lib/data.ts
|   |-- pages/index.astro
|   |-- styles/global.css
|   `-- types/content.ts
|-- astro.config.mjs
|-- package.json
`-- tsconfig.json
```

## 数据文件说明

- `src/data/site.yaml`
	- SEO 信息（标题、描述、域名、语言、OG 图）
	- 品牌信息（名称、口号、Logo、首屏按钮）
	- 导航配置与各分区文案
	- 页脚链接与版权信息
- `src/data/members.yaml`
	- 队员信息：昵称、姓名、方向、任期、简介、链接
	- 成员状态：`featured`、`current`、`alumni`
- `src/data/honors.yaml`
	- 代表性竞赛成绩（奖项、级别、时间、地点、描述）
- `src/data/timeline.yaml`
	- 团队关键节点与赛事里程碑（按时间线展示）
- `src/data/recruitment.yaml`
	- 招新介绍、方向、目标人群、要求、FAQ、联系邮箱

## 当前内容概览（来自实际数据）

- 团队定位：南京理工大学网络安全校队，强调基础训练、团队协作与持续成长。
- 成员结构：含核心成员、在队成员与校友成员，覆盖 Web / Pwn / Reverse / Crypto / Misc。
- 代表成绩：包括 CISCNx 长城杯浙江赛区一等奖、研究生网安创新大赛国赛二等奖、江苏省密码竞赛连冠等。
- 历程节点：从 2020 年成立到近年多项省赛/国赛突破，形成持续积累的成长路径。
- 招新理念：欢迎有好奇心与耐心、愿意长期投入训练的同学加入。

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:4321`

## 构建与预览

```bash
npm run build
npm run preview
```

- 构建产物目录：`dist/`
- 可部署到任意静态托管平台（GitHub Pages、Cloudflare Pages 等）

## 内容维护建议

- 更新团队文案或导航：编辑 `src/data/site.yaml`
- 更新成员信息：编辑 `src/data/members.yaml`
- 更新赛事荣誉：编辑 `src/data/honors.yaml`
- 更新历程事件：编辑 `src/data/timeline.yaml`
- 更新招新信息：编辑 `src/data/recruitment.yaml`

所有内容改动均无需修改组件逻辑，提交 YAML 后重新构建即可生效。
