import React from 'react';
import { Handle, Position } from '@xyflow/react';

const styles = {
  node: {
    background: 'var(--surface)',
    border: '1px solid var(--border2)',
    borderRadius: '12px',
    padding: '0',
    width: '340px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(108,99,255,0.1)',
    animation: 'fade-in 0.4s ease',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'var(--surface2)',
    borderBottom: '1px solid var(--border)',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px rgba(108,99,255,0.8)',
    flexShrink: 0,
  },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--accent)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  tag: {
    marginLeft: 'auto',
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
  },
  body: {
    padding: '14px 16px',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px',
    color: 'var(--text)',
    fontFamily: 'var(--mono)',
    fontSize: '13px',
    lineHeight: '1.6',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  hint: {
    marginTop: '8px',
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '0.05em',
  },
};

export default function InputNode({ data, selected }) {
  return (
    <div
      style={{
        ...styles.node,
        borderColor: selected ? 'var(--accent)' : 'var(--border2)',
        boxShadow: selected
          ? '0 4px 24px rgba(0,0,0,0.4), 0 0 0 2px rgba(108,99,255,0.4)'
          : styles.node.boxShadow,
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.dot} />
        <span style={styles.label}>Prompt Input</span>
        <span style={styles.tag}>NODE_01</span>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <textarea
          style={styles.textarea}
          placeholder="Ask anything... e.g. What is the capital of France?"
          value={data.prompt || ''}
          onChange={(e) => data.onPromptChange(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent)';
            e.target.style.boxShadow = '0 0 0 2px rgba(108,99,255,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
          // Prevent React Flow from hijacking keyboard events
          onKeyDown={(e) => e.stopPropagation()}
        />
        <p style={styles.hint}>// type your prompt above</p>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{ right: '-6px', top: '50%' }}
      />
    </div>
  );
}
