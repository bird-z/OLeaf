const AnimatedList = ({ items, children, className = '' }) => {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <p>No data available.</p>
      </div>
    )
  }

  return (
    <div className={`animated-list ${className}`}>
      {items.map((item, i) => (
        <div key={item?.id ?? i}>
          {children(item, i)}
        </div>
      ))}
    </div>
  )
}

export default AnimatedList
