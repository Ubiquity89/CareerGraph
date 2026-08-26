import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function GraphExplorer({ graph }) {
  if (!graph) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <p className="text-slate-500">
          No graph data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

      <div className="p-5 border-b border-slate-200">
        <h3 className="font-bold text-lg">
          Career Graph
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Explore how skills connect to your target role.
        </p>
      </div>

      <div style={{ height: "550px" }}>

        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

      </div>

    </div>
  );
}

export default GraphExplorer;