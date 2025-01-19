const ENDPOINT = "http://localhost:3000/auth";

export async function login(email, password) {
  try {
    const response = await fetch(`http://localhost:3000/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Erro:', errorData.message);
      return;
    }

    const data = await response.json();
    const token = data.token;

    alert('Login bem-sucedido!');

    return token;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
};