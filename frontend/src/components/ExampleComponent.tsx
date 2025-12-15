import React from 'react';

const ExampleComponent: React.FC = () => {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold gradient-text">
            Neo-Tech Design System
          </h1>
          <p className="text-text-light text-lg">
            A bright, modern theme for AI-driven platforms
          </p>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-hover">
            <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="text-white text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              Primary Color
            </h3>
            <p className="text-text-light" style={{ color: 'var(--color-text-light)' }}>
              Deep indigo for primary actions and brand elements
            </p>
          </div>

          <div className="card-hover">
            <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="text-white text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              Accent Color
            </h3>
            <p className="text-text-light">
              Bright cyan for highlights and interactive elements
            </p>
          </div>

          <div className="card-hover">
            <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))' }}>
              <span className="text-white text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              Gradient Magic
            </h3>
            <p className="text-text-light">
              Beautiful gradients combining both theme colors
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-text mb-6">
            Button Examples
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">
              Primary Action
            </button>
            <button className="btn-accent">
              Accent Action
            </button>
          </div>
        </div>

        {/* Large Feature Card */}
        <div className="card shadow-card-lg">
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-accent rounded-xl"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text mb-3">
                AI-Powered Platform
              </h2>
              <p className="text-text-light mb-4">
                Experience the future of technology with our Neo-Tech design system. 
                Clean, modern, and optimized for the best user experience.
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                  Machine Learning
                </span>
                <span className="px-3 py-1 bg-accent-50 text-accent-600 rounded-full text-sm font-medium">
                  Analytics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;