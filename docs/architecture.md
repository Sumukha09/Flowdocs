# Module map

FlowDocs has two runtime adapters: FastAPI and MCP. Both call the same run lifecycle operations and workflow runner where their behavior overlaps. The adapters own transport-specific input/output details.

## Backend modules

- `app.api.routes`: HTTP paths, request parsing, response schemas, and HTTP error mapping.
- `app.mcp.tools`: MCP tool declarations and MCP-specific validation/result formatting.
- `app.services.run_workflow`: run creation, checkpoint lookup, finding review transitions, approval checkpoint changes, and run-detail assembly.
- `app.services.workflow_runner`: graph invocation and terminal run-status persistence.
- `app.workflow.graph`: graph topology and compilation only.
- `app.workflow.constants`: canonical graph node names.
- `app.workflow.state`: checkpoint schema and typed lifecycle vocabulary.
- `app.workflow.dependencies`: internal injectable session, LLM, and settings factories.
- `app.workflow.ingest`, `extract`, `analyze`, `verify`, `approval`, and `completion`: node implementations grouped by operation.
- `app.models`: persisted entities and relationships.

The `services` modules contain cohesive behavior. Avoid adding wrappers that only forward calls to ORM or graph methods; a useful module should hide lifecycle rules, read-model assembly, or workflow behavior from its callers.

## Data ownership

LangGraph checkpoints own step-by-step progress and references to produced records. The `Run` row owns coarse status and input/report metadata. Domain tables own the full document, claim, finding, evidence, approval, audit, and cost data. API/MCP responses are adapter projections and do not define a second persistence model.

## Frontend modules

- `App.jsx` owns route composition and mounts `components/layout/Layout.jsx` as the application shell.
- `pages/RunDetail.jsx` presents the workflow execution trace.
- `hooks/useRunDetail.js` owns polling, upload/resume actions, and run-detail state.
- `api.js` owns HTTP transport functions.

There is one active layout implementation under `components/layout`. The unused legacy `components/Layout.jsx` was removed.
