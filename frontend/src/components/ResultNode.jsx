import React from 'react';
import { Handle, Position } from '@xyflow/react';

const styles = {
  node: {
    background: 'var(--surface)',
    border: '1px solid var(--border2)',
    borderRadius: '12px',
    width: '380px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
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
    background: 'var(--accent3)',
    boxShadow: '0 0 8px rgba(67,233,123,0.8)',
    flexShrink: 0,
  },
  dotIdle: {
    background: 'var(--text-dim)',
    boxShadow: 'none',
  },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--accent3)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  labelIdle: { color: 'var(--text-muted)' },
  tag: {
    marginLeft: 'auto',
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
  },
  body: {
    padding: '14px 16px',
    minHeight: '120px',
  },
  output: {
    width: '100%',
    minHeight: '100px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px',
    color: 'var(--text)',
    fontFamily: 'var(--mono)',
    fontSize: '13px',
    lineHeight: '1.7',
    overflowY: 'auto',
    maxHeight: '260px',
    whiteSpace: 'pre-wrap',
  },
  placeholder: {
    color: 'var(--text-dim)',
    fontStyle: 'italic',
    fontSize: '12px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
    fontSize: '12px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid var(--border2)',
    borderTop: '2px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
  footer: {
    padding: '8px 16px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  model: {
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--text-dim)',
    letterSpacing: '0.05em',
  },
  tokens: {
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--text-dim)',
  },
};

export default function ResultNode({ data, selected }) {
  const hasResponse = data.response && data.response.length > 0;
  const isLoading = data.loading;

  return (
    <div
      style={{
        ...styles.node,
        borderColor: selected ? 'var(--accent3)' : hasResponse ? 'rgba(67,233,123,0.3)' : 'var(--border2)',
        boxShadow: hasResponse
          ? '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(67,233,123,0.15)'
          : styles.node.boxShadow,
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{ left: '-6px', top: '50%' }}
      />

      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.dot, ...(hasResponse || isLoading ? {} : styles.dotIdle) }} />
        <span style={{ ...styles.label, ...(hasResponse || isLoading ? {} : styles.labelIdle) }}>
          AI Response
        </span>
        <span style={styles.tag}>NODE_02</span>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {isLoading ? (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <span>Generating response...</span>
          </div>
        ) : (
          <div style={styles.output}>
            {hasResponse ? (
              <span>{data.response}</span>
            ) : (
              <span style={styles.placeholder}>
                // response will appear here after clicking Run Flow
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.model}>
          gemini-2.0-flash-lite:free
        </span>
        {hasResponse && (
          <span style={styles.tokens}>
            {data.response.split(' ').length} words
          </span>
        )}
      </div>
    </div>
  );
}
