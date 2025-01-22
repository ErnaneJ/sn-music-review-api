import { getSongDetails, createSong } from './songs';
import { setFlash } from '$lib/stores/flash.svelte';

export async function getLastReviews() {
  try {
    const response = await fetch(`http://localhost:3000/reviews/`);

    if (response.ok) {
      const data = await response.json();
      console.log('Reviews encontradas:', data);
      return data;
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
  }
}

export async function createReview(token, song, rating, content) {
  try {
    let dbSong = await getSongDetails(song.id); // Busca os detalhes da música para verificar se ela existe
    console.log('Música encontrada:', dbSong);
    if (!dbSong) {
      dbSong = await createSong({
        title: song.title,
        artist: song.artist.name,
        album: song.album.title,
        genre: song.genre,
        releaseYear: song.releaseYear,
        did: String(song.id),
        cover_image: song.album.cover_big,
        duration: song.duration,
      });

    }

    const response = await fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho para autenticação
      },
      body: JSON.stringify({
        songId: dbSong.id,
        rating: String(rating),
        content,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setFlash('Success', 'Review created successfully' ,'success');
      return data;
    } else {
      const errorData = await response.json();
      setFlash('Error', errorData.message, 'error');
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    setFlash('Error', 'Error creating review', 'error');
    console.error('Erro ao criar review:', error);
  }
}

export async function updateReview(token, reviewId, content, rating) {
  try {
    const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
      },
      body: JSON.stringify({
        content,
        rating,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setFlash('Success', 'Review updated successfully', 'success');
      return data; // Retorna os dados da review atualizada
    } else {
      const errorData = await response.json();
      setFlash('Error', errorData.message, 'error');
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    setFlash('Error', 'Error updating review', 'error');
    console.error('Error updating review:', error);
  }
}

export async function deleteReview(token, reviewId) {
  try {
    const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
      },
    });

    if (response.ok) {
      setFlash('Success', 'Review deleted successfully', 'success');
      return true; // Review excluída com sucesso
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao excluir review:', error);
  }
}

export async function getReviewsBySong(songId) {
  try {
    const response = await fetch(`http://localhost:3000/reviews/song/${songId}`);

    if (response.ok) {
      const data = await response.json();
      console.log('Reviews encontradas:', data);
      return data;
    } else {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
  }
}