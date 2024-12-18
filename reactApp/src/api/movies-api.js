export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=37c96bbe42a6e98a056dc60f73cb4dad&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };