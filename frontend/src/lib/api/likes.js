export async function addLike(token, reviewId) {
  try {
    const response = await fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
      body: JSON.stringify({ reviewId }),
    });

    if (response.ok) {
      console.log('Like adicionado com sucesso');
    } else {
      const errorData = await response.json();
      console.log('Erro ao adicionar like:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao adicionar like:', error);
  }
}

export async function removeLike(token, reviewId) {
  try {
    const response = await fetch('http://localhost:3000/likes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
      body: JSON.stringify({ reviewId }),
    });

    if (response.ok) {
      console.log('Like removido com sucesso');
    } else {
      const errorData = await response.json();
      console.log('Erro ao remover like:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao remover like:', error);
  }
}

export async function getLikesByReview(reviewId) {
  try {
    const response = await fetch(`http://localhost:3000/likes/${reviewId}`);

    if (response.ok) {
      const data = await response.json();
      console.log('Lista de likes para a avaliação:', data);
      return data; // Retorna a lista de likes
    } else {
      const errorData = await response.json();
      console.log('Erro ao buscar likes:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao buscar likes:', error);
  }
}