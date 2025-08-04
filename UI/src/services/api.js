export async function getHelloWorld() {
  try {
    const response = await fetch(`http://localhost:3000/`);
    return await response.text();
  } catch (error) {
    throw new Error(error);
  }
}

//test
