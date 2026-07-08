---
name: create-agent
description: |
  Use when the user asks to create, define, or design a new agent, subagent,
  skill, or command. Also use when the user says "I need an agent that...",
  "create me a subagent for...", "make a skill that...", or "add a command
  to...". Do NOT use for editing existing agents/skills/commands.
---

# Create Agent / Skill / Command

## 1. Clarify what they want

Ask the user (if not already stated):

- **Agent** (`.opencode/agents/<name>.md`) — a reusable AI assistant for primary or subagent use
- **Skill** (`.opencode/skills/<name>/SKILL.md`) — contextual instructions auto-loaded when the task matches the skill's description
- **Command** (`.opencode/commands/<name>.md`) — a slash-command template like `/deploy`

Confirm: project scope (`.opencode/`) or global (`~/.config/opencode/`)?

## 2. Gather intent

Identify:
- Name (kebab-case, ≤64 chars)
- One-sentence description of what it does and when to trigger it
- Key capabilities / behavioral rules
- Permissions (edit, bash, read-only?)
- Model override (optional, defaults to parent)
- Mode: `primary`, `subagent`, or `all`

## 3. Generate the file

### Agent / Subagent

`.opencode/agents/<name>.md`

```markdown
---
description: <one sentence, front-load trigger keywords>
mode: subagent
permission:
  edit: deny
  bash: deny
---

<prompt body>
```

### Skill

`.opencode/skills/<name>/SKILL.md`

```markdown
---
name: <name>
description: <same rules — front-load trigger keywords, "Use when...">
---

# <Name>

<instructions>
```

### Command

`.opencode/commands/<name>.md`

```markdown
---
description: <what it does>
---

<template with $ARGUMENTS>
```

## 4. Validation checklist

- [ ] Description front-loads trigger keywords
- [ ] Name is kebab-case, ≤64 chars
- [ ] File is in the correct directory (not root)
- [ ] Agent frontmatter has `mode:` and `description:`
- [ ] Permissions match the intent (read-only? needs bash?)
- [ ] Confirm with user before writing
