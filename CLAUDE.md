# ccrecall

CLI tool that syncs Claude Code transcripts to SQLite for analytics
and context recall.

## Tech Stack

- **Runtime:** Bun (>=1.0) — `bun:sqlite` for DB, `Bun.Glob` for file
  discovery
- **Language:** TypeScript (strict, ES2024, NodeNext modules)
- **CLI framework:** citty
- **Release:** changesets
- **Formatting:** prettier
- **Tests:** bun:test

## Architecture

```
src/
  index.ts        # Entry point, Bun runtime guard
  cli.ts          # Command definitions (sync, stats, search, sessions, query, tools)
  db.ts           # Database class, schema DDL, prepared statements, FTS5
  sync.ts         # Scans ~/.claude/projects/**/*.jsonl, incremental sync
  sync-teams.ts   # Syncs ~/.claude/teams/ and ~/.claude/tasks/
  parser.ts       # JSONL transcript line → structured messages
tests/
  cli.test.ts     # CLI structure validation (32 tests)
  db.test.ts      # DB operations + FTS5 edge cases (28 tests)
```

## Key Patterns

- **Incremental sync:** `sync_state` table tracks file mtime + byte
  offset to skip unchanged content
- **FTS5 search:** `messages_fts` virtual table with auto-sync
  triggers on INSERT/UPDATE/DELETE
- **`escape_fts5_query()`** in db.ts wraps special chars in quotes,
  preserves prefix/phrase syntax
- **Batch transactions** with foreign keys disabled during bulk insert
  for performance
- **Prepared statements** for all DML operations
- **UPSERT semantics** — sync is idempotent

## Commands

```bash
bun test                    # Run tests
bun run lint                # TypeScript type check (tsc --noEmit)
bun run format              # Prettier
bun run format:check        # Prettier check
bun run build               # Compile standalone binary
bun src/index.ts <command>  # Run from source
```

## DB Schema

Core tables: `sessions`, `messages`, `tool_calls`, `tool_results`,
`teams`, `team_members`, `team_tasks`, `sync_state`, `messages_fts`

Schema DDL lives in `SCHEMA` constant in `db.ts`.

## Adding Features

1. New command → add to `cli.ts` via `citty.defineCommand()`
2. New table/query → add to `db.ts` (schema + methods)
3. New sync logic → modify `sync.ts` or `sync-teams.ts`
4. Always add tests in `tests/`

## Gotchas

- FTS5 special chars (`.` `/` `-` `:` `()` `^` `+` `'`) must be
  escaped — see `escape_fts5_query()`
- Legacy migration: `cclog.db` → `ccrecall.db` handled automatically
- Auto-migration resets `sync_state` when tool_calls table is empty
  but messages exist
- `src/commands/` dir exists but is empty — commands are inline in
  `cli.ts`
