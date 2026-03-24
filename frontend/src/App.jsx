import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InputNode from './components/InputNode';
import ResultNode from './components/ResultNode';
import Toolbar from './components/Toolbar';

// ── Custom node types ─────────────────────────────────────────────────────────
const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

// ── API base ──────────────────────────────────────────────────────────────────
const API =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

// ── Initial graph ─────────────────────────────────────────────────────────────
const makeInitialNodes = (onPromptChange) => [
  {
    id: 'input-1',
    type: 'inputNode',
    position: { x: 80, y: 200 },
    data: { prompt: '', onPromptChange },
  },
  {
    id: 'result-1',
    type: 'resultNode',
    position: { x: 520, y: 185 },
    data: { response: '', loading: false },
  },
];

const initialEdges = [
  {
    id: 'edge-1',
    source: 'input-1',
    sourceHandle: 'out',
    target: 'result-1',
    targetHandle: 'in',
    type: 'smoothstep',
    animated: false,
  },
];

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedFlows, setSavedFlows] = useState([]);

  // Build node data with current state
  const buildNodes = useCallback(
    (res = response, load = loading) => [
      {
        id: 'input-1',
        type: 'inputNode',
        position: { x: 80, y: 200 },
        data: {
          prompt,
          onPromptChange: (v) => setPrompt(v),
        },
      },
      {
        id: 'result-1',
        type: 'resultNode',
        position: { x: 520, y: 185 },
        data: { response: res, loading: load },
      },
    ],
    [prompt, response, loading]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    makeInitialNodes((v) => setPrompt(v))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes when prompt/response/loading changes
  useEffect(() => {
    setNodes([
      {
        id: 'input-1',
        type: 'inputNode',
        position: nodes.find((n) => n.id === 'input-1')?.position || { x: 80, y: 200 },
        data: {
          prompt,
          onPromptChange: (v) => setPrompt(v),
        },
      },
      {
        id: 'result-1',
        type: 'resultNode',
        position: nodes.find((n) => n.id === 'result-1')?.position || { x: 520, y: 185 },
        data: { response, loading },
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, response, loading]);

  // Animate edge when running
  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => ({ ...e, animated: loading }))
    );
  }, [loading, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // ── Load history on mount ─────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/flows`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setSavedFlows(data))
      .catch(() => {});
  }, []);

  // ── Run Flow ──────────────────────────────────────────────────────────────
  const handleRun = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt first!');
      return;
    }
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch(`${API}/api/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data.response);
    } catch (err) {
      setResponse(`⚠️ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Save Flow ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/api/save-flow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, response }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh history
        const history = await fetch(`${API}/api/flows`).then((r) => r.json());
        if (Array.isArray(history)) setSavedFlows(history);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar
        onRun={handleRun}
        onSave={handleSave}
        loading={loading}
        hasSaveable={!!(prompt && response && !loading)}
        savedFlows={savedFlows}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1e1e30"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => (n.type === 'inputNode' ? '#6c63ff' : '#43e97b')}
          maskColor="rgba(8,8,16,0.7)"
        />
      </ReactFlow>

      {/* Bottom hint */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--mono)',
        fontSize: '10px',
        color: 'var(--text-dim)',
        letterSpacing: '0.1em',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        // drag nodes · scroll to zoom · ctrl+scroll to zoom faster
      </div>
    </div>
  );
}
