# Workflow state contract

`app.workflow.state.WorkflowState` is the checkpoint and inter-node state contract. It is a JSON-serializable mapping; nodes store identifiers and primitive values, not ORM objects, open sessions, clients, or file bytes.

## Stage vocabulary

The graph nodes are `ingest`, `extract`, `analyze`, `verify`, `approval`, and `complete`. `current_stage` can also contain `failed` or `completed` because existing node results use those terminal markers. `completed_stages` contains graph node names.

`approve` and `finalize` remain accepted by the state type for checkpoints created against the earlier contract. New graph execution does not emit those names. This compatibility allowance avoids rejecting old checkpoint data while the canonical graph vocabulary stays aligned with the graph.

## Status vocabulary

Workflow state status values are `pending`, `running`, `awaiting_approval`, `approved`, `rejected`, `failed`, and `completed`. Database run status is persisted on the `Run` record and may be merged into the state returned by an adapter when graph state has no status. Finding status is separate and includes `pending`, `approved`, and `rejected`.

## Ownership

- The checkpoint owns workflow progress: current stage, completed stages, generated document/chunk/claim/finding IDs, review decisions, errors, and token counters.
- The `runs` row owns the durable coarse run status, timestamps, trigger source, and input metadata such as source paths, compliance rules, and report metadata.
- Document, claim, finding, evidence, approval, audit, and cost records own their detailed persisted data. Checkpoints refer to them by string IDs.
- HTTP and MCP adapters combine checkpoint and database values for their own response shapes. They preserve their existing error and response behavior.

`Stage`, `Status`, and `ApprovalDecision` are `Literal` aliases used by `WorkflowState` and the HTTP run-state schema. Changes to values already stored in checkpoints require compatibility treatment; changing a type annotation alone must not migrate checkpoint contents.
