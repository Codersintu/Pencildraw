import './index.css'
function Animationbox() {
  return (
     <div className="relative w-full aspect-square max-w-xl mx-auto">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-purple-50 rounded-3xl transform rotate-3 animate-float"></div>

      <div className="relative bg-linear-to-r from-[#465362] via-[#62240C] to-[#62240C] rounded-3xl shadow-2xl p-8 border-2 border-gray-200 animate-float-delayed">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <rect
            x="50"
            y="80"
            width="120"
            height="80"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="animate-draw-shape"
            style={{ animationDelay: '0.2s' }}
          />

          <circle
            cx="250"
            cy="120"
            r="50"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="animate-draw-shape"
            style={{ animationDelay: '0.4s' }}
          />

          <path
            d="M 110 160 L 250 120"
            stroke="#ec4899"
            strokeWidth="2"
            fill="none"
            className="animate-draw-shape"
            style={{ animationDelay: '0.8s' }}
          />

          <path
            d="M 50 250 L 100 200 L 150 250 L 200 200"
            stroke="#10b981"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-shape"
            style={{ animationDelay: '1s' }}
          />

          <polygon
            points="280,220 330,220 305,270"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="animate-draw-shape"
            style={{ animationDelay: '1.2s' }}
          />

          <text
            x="60"
            y="110"
            fontFamily="Arial"
            fontSize="14"
            fill="#3b82f6"
            className="animate-fade-in"
            style={{ animationDelay: '1.4s' }}
          >
            Ideas
          </text>

          <text
            x="230"
            y="115"
            fontFamily="Arial"
            fontSize="14"
            fill="#8b5cf6"
            className="animate-fade-in"
            style={{ animationDelay: '1.6s' }}
          >
            Flow
          </text>

          <g className="animate-pulse-slow" style={{ animationDelay: '2s' }}>
            <circle cx="350" cy="100" r="8" fill="#3b82f6" />
            <circle cx="370" cy="120" r="8" fill="#8b5cf6" />
            <circle cx="360" cy="140" r="8" fill="#ec4899" />
          </g>
        </svg>
      </div>

      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-200 rounded-2xl transform rotate-12 animate-bounce-slow"></div>
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-200 rounded-full animate-pulse-slow"></div>
    </div>
  )
}

export default Animationbox