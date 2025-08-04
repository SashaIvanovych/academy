export async function getHelloWorld() {
  try {
    const response = await fetch(
      `http://localhost:3000/ivanovych-test/returnHello`
    );
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
}
