function MinimalApp() {
  return (
    <div style={{ padding: '50px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>Minimal Test App</h1>
      <p style={{ color: '#666' }}>
        If you can see this, React is rendering successfully!
      </p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2>Debug Info:</h2>
        <ul>
          <li>React: ✅ Working</li>
          <li>Vite: ✅ Working</li>
          <li>Rendering: ✅ Working</li>
        </ul>
      </div>
    </div>
  );
}

export default MinimalApp;
