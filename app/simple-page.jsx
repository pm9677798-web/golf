export default function SimplePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ 
          background: 'white', 
          padding: '1rem 2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, #0ea5e9, #a855f7)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px'
              }}>
                ♥
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                GolfHeart
              </h1>
            </div>
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>How It Works</a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Charities</a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Login</a>
              <button style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Join Now
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main style={{ 
          background: 'white', 
          padding: '4rem 2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Play Golf. <span style={{ 
              background: 'linear-gradient(135deg, #a855f7, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Change Lives.</span>
          </h2>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#6b7280', 
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Track your golf scores, enter monthly prize draws, and automatically donate to charities you care about. 
            Every round you play creates positive impact.
          </p>

          {/* Impact Counter */}
          <div style={{ 
            background: '#f8fafc', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '2rem',
            display: 'inline-block'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #a855f7, #9333ea)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
              }}>
                ♥
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Raised for Charity</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>
                  $125,000
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Start Playing for Purpose →
            </button>
            <button style={{
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              Learn How It Works
            </button>
          </div>
        </main>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {[
            { icon: '🏆', title: 'Monthly Draws', desc: 'Win prizes based on your scores' },
            { icon: '♥', title: 'Charity Impact', desc: 'Support causes you believe in' },
            { icon: '🎯', title: 'Score Tracking', desc: 'Simple Stableford scoring' },
            { icon: '👥', title: 'Community', desc: 'Join like-minded golfers' }
          ].map((feature, index) => (
            <div key={index} style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div style={{ 
          background: '#dbeafe', 
          border: '1px solid #93c5fd',
          padding: '1rem', 
          borderRadius: '8px', 
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#1e40af', margin: 0, fontWeight: '600' }}>
            🚧 Platform is being set up! Run "npm install" and follow the setup guide to get started.
          </p>
        </div>
      </div>
    </div>
  )
}