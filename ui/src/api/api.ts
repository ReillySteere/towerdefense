export const fetchGreeting = async (): Promise<string> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve('Hello from the API!'), 1000),
  );
};
