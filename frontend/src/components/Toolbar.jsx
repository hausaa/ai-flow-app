import React, { useState } from 'react';

const S = {
  bar: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '8px 12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
  },
  logo: {
    fontFamily: 'var(--sans)',
    fontWeight: 800,
    fontSize: '15px',
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  logoAccent: { color: 'var(--accent)' },
  divider: {
    width: '1px',
    height: '24px',
    background: 'var(--border)',
    marginInline: '4px',
  },
  btn: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    letterSpacing: '0.1em',
    fontWeight: 700,
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  runBtn: {
    background: 'var(--accent)',
    color: '#fff',
    boxShadow: '0 0 12px rgba(108,99,255,0.4)',
  },
  runBtnLoading: {
    background: 'var(--border2)',
    color: 'var(--text-muted)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  saveBtn: {
    background: 'transparent',
    color: 'var(--accent3)',
    border: '1px solid rgba(67,233,123,0.3)',
  },
  historyBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
  },
  spinner: {
    width: '10px',
    height: '10px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  status: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    letterSpacing: '0.05em',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  statusSuccess: {
    background: 'rgba(67,233,123,0.1)',
    color: 'var(--accent3)',
    border: '1px solid rgba(67,233,123,0.2)',
  },
  statusError: {
    background: 'rgba(255,101,132,0.1)',
    color: 'var(--accent2)',
    border: '1px solid rgba(255,101,132,0.2)',
  },
};

// ── History Panel ─────────────────────────────────────────────────────────────
function HistoryPanel({ history, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          borderRadius: '16px',
          width: '600px',
          maxHeight: '70vh',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          animation: 'fade-in 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            // Saved Flows
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: '18px', lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ overflowY: 'auto', padding: '12px' }}>
          {history.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
              No saved flows yet. Run and save one!
            </div>
          ) : (
            history.map((item, i) => (
              <div key={item._id || i} style={{
                marginBottom: '10px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '14px 16px',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', marginBottom: '6px', letterSpacing: '0.1em' }}>
                  PROMPT
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text)', marginBottom: '10px' }}>
                  {item.prompt}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent3)', marginBottom: '6px', letterSpacing: '0.1em' }}>
                  RESPONSE
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {item.response?.slice(0, 200)}{item.response?.length > 200 ? '...' : ''}
                </div>
                {item.createdAt && (
                  <div style={{ marginTop: '8px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-dim)' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────
export default function Toolbar({ onRun, onSave, loading, hasSaveable, savedFlows }) {
  const [showHistory, setShowHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error' | null

  const handleSave = async () => {
    setSaveStatus('saving');
    const result = await onSave();
    setSaveStatus(result ? 'saved' : 'error');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  return (
    <>
      <div style={S.bar}>
        <div style={S.logo}>
          <span style={S.logoAccent}>◈</span>
          <span>AI<span style={S.logoAccent}>Flow</span></span>
        </div>
        <div style={S.divider} />

        {/* Run button */}
        <button
          style={{ ...S.btn, ...(loading ? S.runBtnLoading : S.runBtn) }}
          onClick={onRun}
          disabled={loading}
        >
          {loading ? (
            <>
              <div style={S.spinner} />
              Running…
            </>
          ) : (
            <>▶ Run Flow</>
          )}
        </button>

        {/* Save button */}
        <button
          style={{
            ...S.btn,
            ...S.saveBtn,
            opacity: hasSaveable ? 1 : 0.4,
            cursor: hasSaveable ? 'pointer' : 'not-allowed',
          }}
          onClick={hasSaveable ? handleSave : undefined}
          disabled={!hasSaveable || saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? '↻ Saving…' : '↓ Save'}
        </button>

        {/* History button */}
        <button
          style={{ ...S.btn, ...S.historyBtn }}
          onClick={() => setShowHistory(true)}
        >
          ≡ History
        </button>

        {/* Status chip */}
        {saveStatus === 'saved' && (
          <span style={{ ...S.status, ...S.statusSuccess }}>✓ saved to DB</span>
        )}
        {saveStatus === 'error' && (
          <span style={{ ...S.status, ...S.statusError }}>✕ save failed</span>
        )}
      </div>

      {showHistory && (
        <HistoryPanel history={savedFlows} onClose={() => setShowHistory(false)} />
      )}
    </>
  );
}
