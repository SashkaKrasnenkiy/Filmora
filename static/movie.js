const videoContainer = document.getElementById('video-container');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
let hideTimeout;
const episodeList = document.getElementById('episode-list');
const video = document.getElementById('video');

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
let movieId = urlParams.get("id");
let episodeId = urlParams.get("episode");

const leftSeriesBtn = document.getElementById('left-series');
const rightSeriesBtn = document.getElementById('right-series');
const cardsSeries = document.getElementById('cards-series');

// Прокрутка для сериалов
leftSeriesBtn.addEventListener('click', () => {
  cardsSeries.scrollBy({ left: -300, behavior: 'smooth' });
});

rightSeriesBtn.addEventListener('click', () => {
  cardsSeries.scrollBy({ left: 300, behavior: 'smooth' });
});

// Функция для обновления видео
function updateVideo(movieId, episodeId) {
  fetch('static/movie.json')
    .then(response => response.json())
    .then(movies => {
      const movie = movies.find(m => m.url.includes(movieId));
      const episodeWrapper = document.getElementById('episode-wrapper');

      if (movie) {
        if (episodeId) {
          // Ищем эпизод по ID
          const episode = movie.episodes.find(e => e.url.includes(episodeId));
          
          if (episode) {
            video.src = episode.trailer;
            document.title = `${movie.name} - ${episode.title}`;
          }
        } else {
          video.src = movie.Film;
          document.title = movie.name;
        }

        // Показываем или скрываем блок с сериями в зависимости от их наличия
        if (movie.episodes && movie.episodes.length > 0) {
          episodeWrapper.style.display = 'block';
          createEpisodeCards(movie.episodes, movieId);
        } else {
          episodeWrapper.style.display = 'none';
        }
         if (movie.actors && Array.isArray(movie.actors)) {
    createActorCards(movie.actors);
        }
      } else {
        document.body.innerHTML = "<h1>Фильм не найден</h1>";
      }
    })
    .catch(error => {
      console.error("Ошибка при загрузке данных фильма:", error);
      document.body.innerHTML = "<h1>Ошибка при загрузке фильма</h1>";
    });
}
// Изначальная загрузка видео и серий
updateVideo(movieId, episodeId);

// Обработчик изменения URL
window.addEventListener('popstate', () => {
  const urlParams = new URLSearchParams(window.location.search);
  movieId = urlParams.get("id");
  episodeId = urlParams.get("episode");
  updateVideo(movieId, episodeId);
});

// Создание карточек серий
function createEpisodeCards(episodes, movieId) {
  if (!episodeList) return;
  
  episodeList.innerHTML = '';
  
  episodes.forEach(episode => {
    const episodeCard = document.createElement('a');
    episodeCard.classList.add('episode-card');
    episodeCard.href = `movie.html?id=${movieId}&episode=${episode.url.split('=')[1]}`;
    
    episodeCard.innerHTML = `
      <img src="${episode.thumbnail}" alt="${episode.title}">
      <div class="episode-info">
        <h2>${episode.title}</h2>
        <p>${episode.descriptionS}</p>
      </div>
    `;
    
    episodeList.appendChild(episodeCard);
  });
}

// Загрузка списка сериалов
fetch("static/movie.json")
  .then(response => response.json())
  .then(data => {
    const series = data.filter(item => item.type === 'series');
    
    series.forEach(seriesItem => {
      const seriesCard = document.createElement('a');
      seriesCard.classList.add('series-card');
      seriesCard.href = seriesItem.url;
      
      seriesCard.innerHTML = `
        <img src="${seriesItem.sposter}" alt="${seriesItem.name}" class="poster">
        <div class="series-info">
          <h4>${seriesItem.name}</h4>
          <div class="sub">
            <p>${seriesItem.genre}, ${seriesItem.date}</p>
            <h3><span>IMBD </span> <i class="bi bi-star-fill"></i> ${seriesItem.imdb}</h3>
          </div>
        </div>
      `;
      
      cardsSeries.appendChild(seriesCard);
    });
  })
  .catch(error => console.error("Ошибка при загрузке сериалов:", error));





// Загружаем данные из файла movie.json
function createActorCards(actors) {
  const actorList = document.querySelector('.actors-list');
  if (!actorList || !Array.isArray(actors)) return;

  actorList.innerHTML = '';

  actors.forEach(actor => {
    const actorCard = document.createElement('div');
    actorCard.classList.add('actor-card');

    actorCard.innerHTML = `
      <div class="actor-image">
        <img src="${actor.image}" alt="${actor.name}" class="actor-img">
      </div>
      <div class="actor-info">
        <h5>${actor.name}</h5>
        <p>${actor.role}</p>
      </div>
    `;

    actorList.appendChild(actorCard);
  });
}


 