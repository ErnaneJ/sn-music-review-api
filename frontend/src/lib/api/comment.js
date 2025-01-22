export async function createComment(token, content, reviewId, parentId = null) {
  try {
    const response = await fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
      body: JSON.stringify({ content, reviewId, parentId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Comentário criado com sucesso:', data);
      return data; // Retorna os detalhes do comentário criado
    } else {
      const errorData = await response.json();
      console.error('Erro ao criar comentário:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
  }
}

export async function getCommentsByReview(reviewId) {
  try {
    const response = await fetch(`http://localhost:3000/comments/${reviewId}`);

    if (response.ok) {
      const comments = await response.json();
      console.log('Comentários da avaliação:', comments);
      return comments; // Retorna a lista de comentários
    } else {
      const errorData = await response.json();
      console.error('Erro ao buscar comentários:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
  }
}

export async function updateComment(token, commentId, newContent) {
  try {
    const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
      body: JSON.stringify({ content: newContent }),
    });

    if (response.ok) {
      const updatedComment = await response.json();
      console.log('Comentário atualizado com sucesso:', updatedComment);
      return updatedComment; // Retorna os detalhes do comentário atualizado
    } else {
      const errorData = await response.json();
      console.error('Erro ao atualizar comentário:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
  }
}

export async function deleteComment(token, commentId) {
  try {
    const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Token de autenticação
      },
    });

    if (response.ok) {
      console.log('Comentário deletado com sucesso');
    } else {
      const errorData = await response.json();
      console.error('Erro ao deletar comentário:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
  }
}

