import {getSession} from 'next-auth/react';

export type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

type QwackerUserResponse = {
  count?: number;
  data?: User[];
};

export const fetchUsers = async (params?: { limit?: number; accessToken?: string }) => {
  const { limit, accessToken } = params || {};
  const session = await getSession();

  // TODO: Fix this accessToken
  const token = accessToken;

  if (!token) {
    throw new Error('No access token');
  }

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?${new URLSearchParams({
    limit: limit?.toString() || '100',
  })}`;

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: token,
    },
  });
  console.log(res);

  const { count, data } = (await res.json()) as QwackerUserResponse;

  return {
    count,
    users: data,
  };
};
