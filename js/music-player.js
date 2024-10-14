document.addEventListener('DOMContentLoaded', function() {
    const musicTitle = document.getElementById('music-title'),
          musicArtist = document.getElementById('music-artist'),
          musicCover = document.getElementById('music-cover'),
          spotifyAuthButton = document.getElementById('spotify-auth-button'),
          logoutText = document.getElementById('logout-text'),
          musicPlayer = document.querySelector('.music-player'),
          clientId = '36f69f44505644ff8e3d92b4f43de73e',
          redirectUri = 'http://584557.klas4s23.mid-ica.nl/documents/personal_interface/index.html';
    let accessToken = '';

    const formatTime = ms => {
        const minutes = Math.floor(ms / 60000),
              seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const updateMusicInfo = track => {
        if (spotifyAuthButton.style.display !== 'none') {
            musicCover.classList.add('hidden');
            logoutText.classList.add('hidden');
            return;
        }
        if (track) {
            const { name, artists, album } = track;
            musicTitle.textContent = name || 'Unknown Title';
            musicArtist.textContent = artists.map(artist => artist.name).join(', ') || 'Unknown Artist';
            if (album && album.images && album.images.length > 0) {
                musicCover.src = album.images[0].url;
                musicCover.classList.remove('hidden');
                Vibrant.from(album.images[0].url).getPalette((err, palette) => {
                    if (palette && palette.Vibrant) {
                        musicPlayer.style.backgroundColor = palette.Vibrant.getHex();
                    }
                });
            } else {
                musicCover.classList.add('hidden');
                musicPlayer.style.backgroundColor = '';
            }
        } else {
            musicTitle.textContent = 'No media playing';
            musicArtist.textContent = '';
            musicCover.classList.add('hidden');
            musicPlayer.style.backgroundColor = '';
        }
    };

    const fetchCurrentlyPlaying = () => {
        console.log('Fetching currently playing track...');
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        .then(response => {
            if (response.status === 204 || response.status === 205) {
                updateMusicInfo(null);
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data && data.item) {
                updateMusicInfo(data.item);
            } else {
                updateMusicInfo(null);
            }
        })
        .catch(error => {
            console.error('Error fetching currently playing track:', error);
            updateMusicInfo(null);
        });
    };

    const getAccessTokenFromUrl = () => {
        const params = new URLSearchParams(window.location.hash.replace('#', '?'));
        return params.get('access_token');
    };

    const authenticateWithSpotify = () => {
        const scopes = 'user-read-playback-state',
              authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
        window.location.href = authUrl;
    };

    const logoutFromSpotify = () => {
        accessToken = '';
        sessionStorage.removeItem('spotifyAccessToken');
        spotifyAuthButton.style.display = 'block';
        logoutText.classList.add('hidden');
        musicTitle.textContent = 'No media playing';
        musicArtist.textContent = '';
        musicCover.classList.add('hidden');
        musicPlayer.style.backgroundColor = '';

        // Clear the access token from the URL
        window.location.hash = '';
    };

    spotifyAuthButton.addEventListener('click', authenticateWithSpotify);
    logoutText.addEventListener('click', logoutFromSpotify);

    // Retrieve access token from URL or session storage
    accessToken = getAccessTokenFromUrl();
    if (accessToken) {
        sessionStorage.setItem('spotifyAccessToken', accessToken);
        window.location.hash = ''; // Clear the access token from the URL
    } else {
        accessToken = sessionStorage.getItem('spotifyAccessToken');
    }

    console.log('Access token:', accessToken);
    if (accessToken) {
        spotifyAuthButton.style.display = 'none';
        logoutText.classList.remove('hidden');
        fetchCurrentlyPlaying();
    }
});