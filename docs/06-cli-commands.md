# CLI Commands

New CLI commands for memory extraction and context bootstrapping.

---

## Existing Commands

### `cclog sync`

Sync Claude Code transcripts to SQLite database.

```bash
cclog sync [-v] [-d path]

# Options:
#   -v, --verbose    Show detailed output
#   -d, --db <path>  Database path (default: ~/.claude/cclog.db)
```

### `cclog stats`

Show database statistics.

```bash
cclog stats [-d path]

# Output:
#   Sessions, messages, tool calls, tokens usage
```

---

## Memory Extraction Commands

### `cclog extract-memories`

Extract memories from session transcripts.

```bash
# Extract from specific session
cclog extract-memories --session <session-id>

# Extract from sessions since date
cclog extract-memories --since <date>
cclog extract-memories --since yesterday
cclog extract-memories --since 2024-01-15

# Extract all unprocessed sessions
cclog extract-memories --unprocessed
```

**Options:** | Flag | Description | |------|-------------| |
`--session <id>` | Extract from specific session ID | |
`--since <date>` | Extract from sessions after date | |
`--unprocessed` | Only sessions not yet extracted |

**Output:**

```
Extracting memories...
  Session: abc123
    Facts extracted: 4
    Categories: preferences (2), knowledge (1), patterns (1)
  Session: def456
    Facts extracted: 2
    Categories: preferences (1), knowledge (1)

Done!
  Sessions processed: 2
  Total facts: 6
```

---

## Memory Query Commands

### `cclog memories search`

Search extracted memories.

```bash
cclog memories search <query>
cclog memories search "pnpm preference"
cclog memories search "testing patterns" --category patterns
```

**Options:** | Flag | Description | |------|-------------| |
`--category <cat>` | Filter by category |

**Output:**

```
Found 3 memories:

[preferences] confidence: 0.9
  "User prefers pnpm over npm for package management"
  Session: abc123 | 2024-01-15

[preferences] confidence: 0.85
  "Prefers bun for TypeScript projects"
  Session: def456 | 2024-01-10

[patterns] confidence: 0.8
  "Tends to use pnpm workspaces for monorepos"
  Session: ghi789 | 2024-01-08
```

### `cclog memories list`

List all memories, optionally filtered.

```bash
# List all
cclog memories list

# Filter by category
cclog memories list --category preferences
cclog memories list --category knowledge
cclog memories list --category patterns
```

**Categories:**

- `preferences` — User preferences and choices
- `knowledge` — Domain knowledge, project facts
- `patterns` — Behavioral patterns, workflows
- `learnings` — Things learned during sessions

---

## Bootstrap Command

### `cclog bootstrap`

Generate context bootstrap from memories and recent sessions.

```bash
cclog bootstrap --query <query>
cclog bootstrap --query "current project context"
cclog bootstrap --query "user preferences"
```

**Options:** | Flag | Description | |------|-------------| |
`--query <query>` | Semantic query for relevant context | |
`--limit <n>` | Max memories to include (default: 10) |

**Output:** Markdown-formatted context suitable for injection into
Claude session.

```markdown
## User Preferences

- Prefers pnpm for package management
- Uses Bun for TypeScript projects
- Favors concise code over verbose

## Recent Context

- Working on cclog memory feature
- Using SQLite for storage

## Patterns

- Tends to refactor after initial implementation
- Prefers tests alongside implementation
```

**Use case:** Called by `/bootstrap` skill at session start to inject
relevant context.

---

## Global Options

All commands support:

| Flag              | Description                                   |
| ----------------- | --------------------------------------------- |
| `-d, --db <path>` | Database path (default: `~/.claude/cclog.db`) |
| `-v, --verbose`   | Show detailed output                          |
| `-h, --help`      | Show help                                     |

---

## Examples

```bash
# Full workflow: sync, extract, query
cclog sync
cclog extract-memories --unprocessed
cclog memories search "preferences"

# Bootstrap context for new session
cclog bootstrap --query "working on cclog" > context.md

# Check extraction status
cclog stats  # Shows memories count in stats
```
