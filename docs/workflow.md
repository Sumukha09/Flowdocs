# Workflow design

`app.workflow.graph` is the small orchestration module. It defines node order, edges, conditional routing, compilation options, and the compiled graph. Each operation lives in a focused module: `ingest`, `extract`, `analyze`, `verify`, `approval`, or `completion`.

The operations accept `WorkflowState` and optional `WorkflowDependencies`. The graph binds the production dependency set when it is compiled. Direct node calls can omit dependencies and use the same production defaults. The dependency seam covers session factories, LLM adapter factories, and settings factories.

`app.workflow.constants` owns node names and expected topology. `app.workflow.state` owns the serializable checkpoint contract. Node names and checkpoint keys are compatibility-sensitive because stored checkpoints may outlive a process deployment.

## Execution and lifecycle

`app.services.workflow_runner.run_graph_background` owns graph invocation and terminal run-status synchronization. HTTP routes, MCP tools, and startup recovery schedule this function using their existing scheduling mechanism.

`app.services.run_workflow` owns shared run operations: initial record creation, checkpoint lookup, review transitions, approval checkpoint updates, and the run-detail read model. HTTP routes map domain errors to HTTP responses; MCP tools keep MCP argument and result shapes. Upload preparation remains in each adapter because the HTTP upload flow and MCP path flow currently persist and identify documents differently.

## Normal flow

```text
ingest -> extract -> analyze -> verify -> approval (when required) -> complete -> END
```

The approval node advances to completion. The graph is compiled with an interrupt before `approval` when a checkpointer is supplied, allowing a caller to record a decision at the `verify` node and resume from the durable checkpoint.

## Adapter responsibilities

- FastAPI routes handle request validation, HTTP status codes, upload transport, and response schemas.
- MCP tools handle tool arguments and MCP result dictionaries.
- Startup recovery finds database runs still marked `running` and schedules the shared workflow runner.
- Frontend `useRunDetail` owns polling, upload/resume actions, and the local run-detail state; the page owns workflow-stage presentation.

Development-only test execution and hard-crash endpoints have been removed from the run API.
