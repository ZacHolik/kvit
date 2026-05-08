export function PoweredByKvikBadge() {
  return (
    <a
      href='https://kvik.online/probaj'
      target='_blank'
      rel='noopener noreferrer'
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '6px',
        background: '#f8f9fa',
        color: '#6b7280',
        fontSize: '12px',
        textDecoration: 'none',
        marginTop: '16px',
      }}
    >
      Izrađeno u <strong style={{ color: '#2563eb' }}>Kvik</strong>
    </a>
  );
}
