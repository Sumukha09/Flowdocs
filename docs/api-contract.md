# Adapter compatibility contract

The backend refactor preserves existing HTTP routes and MCP tool names. These adapters continue to translate inputs and outputs; shared lifecycle operations live under `app.services.run_workflow` and `app.services.workflow_runner`.

## HTTP

The `/api/v1/runs` endpoint set retains its current paths, methods, status codes, and response schemas for run creation, document upload, run state/details, resume, finding approval, reporting, and audit/cost reads. The development-only `/api/v1/runs/run_pytest` and `/api/v1/runs/crash` endpoints have been removed.

The state response uses typed stage/status values that include current graph values and checkpoint compatibility values. No checkpoint data is rewritten by this refactor.

## MCP

The existing tool names remain `create_run`, `get_run`, `get_run_state`, `resume_run`, `add_documents`, `get_findings`, `review_finding`, and `get_report`. Their current argument defaults, validation, response keys, and scheduling behavior remain adapter-owned.

## Compatibility-sensitive behavior

- Background work remains scheduled through FastAPI `BackgroundTasks` for HTTP and daemon threads for MCP/startup recovery.
- Finding review keeps the HTTP audit/edit behavior and MCP approve/reject behavior.
- HTTP uploads and MCP file-path additions retain their current document persistence and duplicate-detection paths.
- Approval checkpoints continue to update at the `verify` node with the same reviewer values.
- Workflow node names, edges, interrupt point, checkpoint IDs, and serialized keys remain stable.
