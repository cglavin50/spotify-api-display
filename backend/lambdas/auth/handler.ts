import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { handleLogin } from './login';
import { handleCallback } from './callback.ts';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const path = event.rawPath;

  if (event.requestContext.http.method === 'GET' && path === '/auth/login') {
    return handleLogin(event);
  }

  if (event.requestContext.http.method === 'POST' && path === '/auth/callback') {
    return handleCallback(event);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  };
};
