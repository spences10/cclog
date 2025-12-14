# cclog

Sync Claude Code transcripts to SQLite for analytics.

## Requirements

- Node.js >= 22.5.0 (uses native `node:sqlite`)

## Install

```bash
pnpm install
pnpm build
```

## Usage

```bash
# Sync transcripts from ~/.claude/projects to SQLite
pnpm dev sync

# Show stats
pnpm dev stats
```

### Commands

| Command | Description                       |
| ------- | --------------------------------- |
| `sync`  | Import transcripts (incremental)  |
| `stats` | Show session/message/token counts |

### Options

| Flag              | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `-v, --verbose`   | Show files being processed                           |
| `-d, --db <path>` | Custom database path (default: `~/.claude/cclog.db`) |

## Database Schema

```sql
sessions (id, project_path, git_branch, cwd, first_timestamp, last_timestamp, summary)
messages (uuid, session_id, parent_uuid, type, model, content_text, content_json, thinking, timestamp, input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens)
sync_state (file_path, last_modified, last_byte_offset)
```

## Example Queries

```sql
-- Token usage by project
SELECT project_path, SUM(input_tokens + output_tokens) as tokens
FROM sessions s
JOIN messages m ON m.session_id = s.id
GROUP BY project_path
ORDER BY tokens DESC;

-- Daily message count
SELECT DATE(timestamp/1000, 'unixepoch') as day, COUNT(*) as messages
FROM messages
GROUP BY day
ORDER BY day DESC;

-- Most used models
SELECT model, COUNT(*) as count
FROM messages
WHERE model IS NOT NULL
GROUP BY model
ORDER BY count DESC;
```

## License

MIT
