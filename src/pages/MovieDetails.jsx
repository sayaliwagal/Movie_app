//components/MovieDetails.jsx
import React, {useState, useEffect}from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieRecommendations, IMAGE_BASE_URL } from '../tmdbService'; // Adjust path if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTag } from '@fortawesome/free-solid-svg-icons';
const MovieDetails = () => {

    const { movieId } = useParams();
    const [ movie, setMovie ] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    useEffect (() => {
        const getMovieDetails = async () => {
            setIsLoading(true);
            setError(null);
            const data = await fetchMovieDetails(movieId);

            console.log("Full movie data:", data);
            if(data){
                setMovie(data);
            } else {
                setError('Failed to fetch movie details. ');
            }
            setIsLoading(false);
        };

        const getRecommendations = async () => {
            const data = await fetchMovieRecommendations(movieId);
            setRecommendations(data);
          };
      
        getMovieDetails();
        getRecommendations();
    }, [movieId]);

    if(loading) {
        return <div className='text-center py-8'>Loading movie details..</div>;
    }
    if(error){
        return <div className='text-red-500 py-8'>Error : {error}</div>;
    }
    if(!movie){
        return <div className='text-gray-500 py-8'>Movie details not found.</div>;
    }
    const {
        backdrop_path,
        budget,
        credits,
        genres,
        original_title,
        overview,
        poster_path,
        release_date,
        revenue,
        runtime,
        status,
        tagline,
        title,
        videos,
        vote_average,
        vote_count
    } = movie;
// Check if videos exists and has results property    // IMPORTANT FIX: Check if videos exists and has results property
    const videoResults = videos && videos.results ? videos.results : [];
    console.log("Video results:", videoResults);

    return (
    <div className='container mx-auto px-4 py-8 flex-col items-center'>
        <div className="relative w-full max-w-4xl mb-8 flex flex-col items-center">
        {backdrop_path && (
            <img className="w-full block object-cover max-h-96" src={`${IMAGE_BASE_URL}${backdrop_path}`} alt={title} />
        )}
        {poster_path && (
            <img className="absolute bottom-[-60px] left-4 md:left-8 w-48 rounded-md shadow-xl border-4 border-white" src={`${IMAGE_BASE_URL}${poster_path}`} alt={`${title} Poster`} />

        )}
        </div>
        <div className="mt-16 text-center md:text-left w-full max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-600 mb-2">{title}</h1>
            {original_title !== title && (
                <h2 className="text-xl italic text-gray-600 mb-4">{original_title}</h2>
            )}
            <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <div className="flex items-center text-yellow-500">
                       <img src="/star.svg" alt="Star Icon" />
                    <span>{vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
                    <span className="text-gray-400 ml-1">{vote_count}</span>
                </div>
                {runtime && (
                    <div className="flex items-center text-gray-300">
                        {/* <FontAwesomeIcon iocn={faClock} className="mr-1" /> */}
                        <FontAwesomeIcon icon={faClock} className="mr-1" />
                        <span>{runtime} min</span>
                    </div>
                )}
                {tagline && (
                    <div className="flex items-center text-gray-300">
                        <FontAwesomeIcon icon={faTag} className="mr-1" />
                        <span className="italic">{tagline}</span>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{overview || 'No overview available.'}</p>
            </div>
            <div className="mb-4">
                <strong className="text-gray-200 mr-2">Release Date:-</strong>
                <span className="text-gray-300">{release_date}</span>
            </div>
            {genres && genres.length > 0 && (
                <div className="mb-4">
                    <strong className="text-gray-100 mr-2">Genres:-</strong>
                    <span className="text-gray-300">{genres.map((genre) => genre.name).join(', ')}</span>
                </div>
            )}
            {runtime && (
                <div className="mb-4">
                    <strong className="text-gray-100 mr-2">Runtime:-</strong>
                    <span className="text-gray-300">{runtime} min</span>
                </div>
            )}
               {runtime && (
                <div className="mb-4">
                    <strong className="text-gray-100 mr-2">Budget:-</strong>
                    <span className="text-gray-300">{budget.toLocaleString()}</span>
                </div>
            )}
            {revenue && (
                <div className="mb-4">
                    <strong className="text-gray-100 mr-2">Revenue:-</strong>
                    <span className="text-gray-300">{revenue.toLocaleString()}</span>
                </div>
            )}
            {status && (
                <div className="mb-4">
                    <strong className="text-gray-100 mr-2">Status:-</strong>
                    <span className="text-gray-300">{status}</span>
                </div>
            )}
            { /* Cast and Crew Section */}
        {credits && credits.cast && credits.cast.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-white text-xl font-semibold mb-2">Cast:-</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {credits.cast.slice(0, 8).map((actor) =>(
                            <div className="bg-gray-700 rounded-md p-2" key={actor.id}>
                                    {actor.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                            alt={actor.name} className='w-full h-auto rounded-md object-cover' />
                                        ) : (
                                            <div className="w-full h-24 bg-gray-600 rounded-md flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                        <p className="text-white text-sm mt-1 text-center">{actor.name}</p>
                                        <p className="text-gray-400 text-xs text-center">as {actor.character}</p>
                                </div>

                                ))}
                        </div>

                       </div>
            )} 
         

        </div>



          {/* Trailers/Videos Section */}
          {videoResults && videoResults.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-white text-xl font-semibold mb-2">Trailers & Clips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videoResults
                            .filter((video) => video.site === 'YouTube' && video.type === 'Trailer') // Filter for YouTube trailers
                            .slice(0, 2) // Display up to 2 trailers
                            .map((video) => (
                                <div key={video.id} className="w-full h-0 pb-[56.25%] relative">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full rounded-md"
                                        src={`https://www.youtube.com/embed/${video.key}`}/* Corrected URL */
                                        title={video.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ))}
                        {videoResults
                            .filter((video) => video.site === 'YouTube' && video.type === 'Clip') // Filter for YouTube clips
                            .slice(0, 2) // Display up to 2 clips
                            .map((video) => (
                                <div key={video.id} className="w-full h-0 pb-[56.25%] relative">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full rounded-md"
                                        src={`https://www.youtube.com/embed/${video.key}`} /* Corrected URL */
                                        title={video.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen

                                    ></iframe>
                                </div>
                            ))}
                        {videoResults.filter(video => video.site !== 'YouTube' || (video.type !== 'Trailer' && video.type !== 'Clip')).length > 0 && (
                            <p className="text-gray-400 text-sm mt-2">More videos might be available.</p>
                        )}
                    </div>
                </div>
            )}
    {/* {recommendations.length > 0 && (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" >
            {recommendations.map(recommendation => (
              <div key={recommendation.id} className="rounded-md shadow-md overflow-hidden">
                <Link to={`/movie/${recommendation.id}`}>
                  {recommendation.poster_path ? (
                    <img
                      className="w-full h-auto object-cover"
                      src={`<span class="math-inline">\{IMAGE\_BASE\_URL\}</span>{recommendation.poster_path}`}
                      alt={recommendation.title}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">No Poster</div>
                  )}
                  <div className="p-2 text-center">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{recommendation.title}</h3>
                  </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div> 
        )}*/}
        {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map(recommendation => (
              <div key={recommendation.id} className="rounded-md shadow-md overflow-hidden">
                <Link to={`/movie/${recommendation.id}`}>
                  {recommendation.poster_path ? (
                    <img
                      className="w-full h-auto object-cover"
                      src={`${IMAGE_BASE_URL}${recommendation.poster_path}`}
                      alt={recommendation.title}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">No Poster</div>
                  )}
                  <div className="p-2 text-center">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{recommendation.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div> 
        
    );};

export default MovieDetails