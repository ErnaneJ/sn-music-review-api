export async function listSongs() {
  try {
    const response = await fetch('http://localhost:3000/songs');
    if (response.ok) {
      const data = await response.json();
      console.log('Músicas encontradas:', data);
      return data; // Retorna a lista de músicas
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao listar músicas:', error);
  }
}

export async function searchSongs(query) {
  try {
    const response = await fetch(`http://localhost:3000/songs/search?query=${encodeURIComponent(query)}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Músicas encontradas para a pesquisa:', data);
      return data; // Retorna as músicas que correspondem à pesquisa
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
  }
}

export async function getSongDetails(songId) {
  try {
    const response = await fetch(`http://localhost:3000/songs/${songId}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Detalhes da música:', data);
      return data; // Retorna os detalhes da música
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao obter detalhes da música:', error);
  }
}

export async function listFavoriteSongs(token) {
  try {
    const response = await fetch('http://localhost:3000/songs/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Músicas favoritas:', data);
      return data; // Retorna a lista de músicas favoritas
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao listar músicas favoritas:', error);
  }
}

export async function addSongToFavorites(token, songId) {
  try {
    const response = await fetch(`http://localhost:3000/songs/${songId}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
    });

    if (response.ok) {
      console.log('Música adicionada aos favoritos');
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao adicionar música aos favoritos:', error);
  }
}

export async function removeSongFromFavorites(token, songId) {
  try {
    const response = await fetch(`http://localhost:3000/songs/${songId}/favorite`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
    });

    if (response.ok) {
      console.log('Música removida dos favoritos');
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao remover música dos favoritos:', error);
  }
}

export async function createSong(data) {
  try {
    const response = await fetch('http://localhost:3000/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Música criada com sucesso:', data);
      return data; // Retorna os dados da música criada
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao criar música:', error);
  }
}

export async function updateSong(songId, title, artist, album, genre, releaseYear) {
  try {
    const response = await fetch(`http://localhost:3000/songs/${songId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        artist,
        album,
        genre,
        releaseYear,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Música atualizada com sucesso:', data);
      return data; // Retorna os dados da música atualizada
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao atualizar música:', error);
  }
}

export async function deleteSong(songId) {
  try {
    const response = await fetch(`http://localhost:3000/songs/${songId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Música excluída com sucesso');
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao excluir música:', error);
  }
}