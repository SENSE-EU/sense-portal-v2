import { useState } from 'react'

export default function AuthDebug() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testTokenEndpoint = async () => {
    setLoading(true)
    try {
      // Test with dummy data
      const response = await fetch('/api/auth/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'test_code_123',
          redirect_uri:
            'https://market-git-feat-fix-auth-v1-ocean-enterprise.vercel.app/auth/callback',
          code_verifier: 'test_verifier_456'
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const checkEnv = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/debug')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Authentication Debug Page</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={checkEnv}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px' }}
        >
          Check Environment Variables
        </button>

        <button
          onClick={testTokenEndpoint}
          disabled={loading}
          style={{ padding: '10px' }}
        >
          Test Token Endpoint
        </button>
      </div>

      {loading && <div>Loading...</div>}

      {result && (
        <div>
          <h2>Result:</h2>
          <pre
            style={{
              background: '#f0f0f0',
              padding: '10px',
              borderRadius: '5px',
              overflow: 'auto',
              maxHeight: '500px'
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
