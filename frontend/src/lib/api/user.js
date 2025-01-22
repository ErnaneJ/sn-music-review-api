import { setFlash } from '$lib/stores/flash.svelte';
const ENDPOINT = "http://localhost:3000";

export async function createUser(email, password) {
  try {
    const response = await fetch(`${ENDPOINT}/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setFlash({title: 'Erro', message: errorData.message, type: 'error'});
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    setFlash({title: 'Sucesso', message: 'User created successfully!', type: 'success'});
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    setFlash({title: 'Erro', message: 'Error creating user', type: 'error'});
  }
};

export async function listUsers(token) {
  try {
    const response = await fetch(`${ENDPOINT}/users`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      setFlash({title: 'Erro', message: errorData.message, type: 'error'});
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing users:', error);
  }
};

export async function getUserDetails(userId) {
  try {
    const response = await fetch(`${ENDPOINT}/users/${userId}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    console.log('Detalhes do usuário:', data);
    return data;
  } catch (error) {
    console.error('Erro ao obter detalhes do usuário:', error);
  }
};

export async function updateUser(userId, name, email, password, image, token) {
  try {
    const response = await fetch(`${ENDPOINT}/users/${userId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    alert('Dados do usuário atualizados com sucesso!');
    return data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
  }
};

export async function followUser(userIdToFollow, token) {
  try {
    const response = await fetch(`${ENDPOINT}/users/follow`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
      },
      body: JSON.stringify({ userIdToFollow }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    alert('Usuário seguido com sucesso!');
    return data;
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
  }
};

export async function unfollowUser(userIdToUnfollow, token) {
  try {
    const response = await fetch(`${ENDPOINT}/users/unfollow`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
      },
      body: JSON.stringify({ userIdToUnfollow }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    alert('Deixou de seguir o usuário com sucesso!');
    return data;
  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
  }
};

export async function listFollowers(userId) {
  try {
    const response = await fetch(`${ENDPOINT}/users/${userId}/followers`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    console.log('Seguidores:', data);
    return data;
  } catch (error) {
    console.error('Erro ao listar seguidores:', error);
  }
};

export async function listFollowing(userId) {
  try {
    const response = await fetch(`${ENDPOINT}/users/${userId}/following`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    console.log('Seguindo:', data);
    return data;
  } catch (error) {
    console.error('Erro ao listar seguindo:', error);
  }
};