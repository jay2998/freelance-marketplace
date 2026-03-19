import { Link } from 'react-router-dom'

const GigCard = ({ gig }) => {
  const avg = gig.starNumber > 0
    ? (gig.totalStars / gig.starNumber).toFixed(1)
    : null

  return (
    <Link to={`/gig/${gig._id}`}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition group">
      <img src={gig.cover} alt={gig.title}
        className="w-full h-44 object-cover group-hover:scale-105 transition duration-300" />
      <div className="p-4">
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
          {gig.category}
        </span>
        <h3 className="font-medium text-gray-800 text-sm mt-2 mb-2 line-clamp-2">{gig.title}</h3>
        {avg && (
          <div className="flex items-center gap-1 text-yellow-500 text-xs mb-2">
            <span>★ {avg}</span>
            <span className="text-gray-400">({gig.starNumber})</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">Starting at</p>
          <p className="font-bold text-green-600">${gig.price}</p>
        </div>
      </div>
    </Link>
  )
}

export default GigCard