type ExpandIconProps = {
  vertical?: boolean
}

export default function ExpandIcon({ vertical = false }: ExpandIconProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
          style={{ 
            transform: vertical 
              ? 'rotate(180deg)' 
              : 'rotate(90deg)',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </div>
    </div>
  )
}
