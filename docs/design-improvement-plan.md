# Behavior-preserving design refactor

This document records the design work applied to FlowDocs. Runtime contracts remain the compatibility reference; this refactor does not rename routes or MCP tools, change workflow topology, or rewrite persisted checkpoint values.

## Backend module design

- `services/run_workflow.py` now owns shared run creation, checkpoint state lookup, finding review transitions, approval checkpoint updates, and run-detail assembly.
- `services/workflow_runner.py` owns graph invocation and terminal run-status synchronization. HTTP, MCP, and startup recovery import it directly; the route module retains its old function symbol for compatibility.
- `workflow/graph.py` now owns graph topology and compilation. Operation implementations are in `ingest.py`, `extract.py`, `analyze.py`, `verify.py`, `approval.py`, and `completion.py`.
- `workflow/dependencies.py` provides an internal seam for session, LLM, and settings factories. Compiled graph nodes receive these dependencies; direct node calls can still use production defaults.
- `workflow/constants.py` is the source of graph node names. `workflow/state.py` is the source of checkpoint keys and lifecycle types.
- Development-only `/runs/run_pytest` and `/runs/crash` endpoints and their route module have been removed.

## Compatibility constraints

- Keep HTTP paths, methods, status codes, response shapes, errors, upload limits, and HTTP duplicate handling.
- Keep MCP tool names, argument defaults, results, validation, and MCP file-path handling.
- Keep graph nodes, edges, checkpoint IDs and keys, interrupt-before-approval behavior, and scheduling choices.
- Keep run status updates, review audit behavior, report metadata, and transaction timing.
- Keep frontend URLs, polling cadence, loading behavior, and upload/resume interactions.

HTTP and MCP document handling intentionally remain adapter-specific because their current persistence and duplicate-detection behavior differs. HTTP review continues to support edits and audit entries; MCP review remains approve/reject only.

## State vocabulary

New workflow states use the graph's names: `ingest`, `extract`, `analyze`, `verify`, `approval`, and `complete`. `failed` and `completed` remain valid `current_stage` terminal values emitted by existing nodes. The type also accepts `approve` and `finalize` for older checkpoints. `WorkflowState` and the HTTP run-state schema use the `Stage` and `Status` literal aliases.

Checkpoint ownership, database run status ownership, and domain-record ownership are described in `state-contract.md`.

## Frontend locality

`hooks/useRunDetail.js` owns run polling, detail loading, upload and resume actions, and associated state. `pages/RunDetail.jsx` owns presentation and stage interpretation. `App.jsx` uses `components/layout/Layout.jsx`; the unused `components/Layout.jsx` was removed.

## Review rule for future changes

Before adding a module, apply the deletion test: if deleting the module makes complexity disappear, it may be a pass-through; if complexity returns across multiple callers, it is providing leverage. Keep internal seams private unless callers or tests have a real reason to depend on them.
