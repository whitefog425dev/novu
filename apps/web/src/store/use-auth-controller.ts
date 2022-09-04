import { useEffect, useMemo, useState } from 'react';
import { IJwtPayload, IOrganizationEntity, IUserEntity } from '@novu/shared';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import * as Sentry from '@sentry/react';
import { getUser } from '../api/user';
import { getOrganizations } from '../api/organization';

export function applyToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common.Authorization;
  }
}

export function getTokenPayload() {
  const token = getToken();
  if (!token) return null;

  return jwtDecode<IJwtPayload>(token);
}

export function getToken(): string {
  return localStorage.getItem('auth_token') as string;
}

export function useAuthController() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(getToken());
  const [jwtPayload, setJwtPayload] = useState<IJwtPayload>();
  const [organization, setOrganization] = useState<IOrganizationEntity>();
  const isLoggedIn = !!token;

  const { data: user } = useQuery<IUserEntity>('/v1/users/me', getUser, {
    enabled: Boolean(isLoggedIn && axios.defaults.headers.common.Authorization),
  });

  const { data: organizations } = useQuery<IOrganizationEntity[]>('/v1/organizations', getOrganizations, {
    enabled: Boolean(
      isLoggedIn &&
        axios.defaults.headers.common.Authorization &&
        jwtDecode<IJwtPayload>(axios.defaults.headers.common.Authorization?.split(' ')[1])?.organizationId
    ),
  });

  useEffect(() => {
    const organizationId = jwtPayload?.organizationId;
    if (!organizationId || !organizations || organizations.length === 0) return;

    setOrganization(organizations.find((org) => org._id === organizationId));
  }, [jwtPayload, organizations]);

  useEffect(() => {
    const localToken = localStorage.getItem('auth_token');

    if (localToken) {
      applyToken(localToken);
      setToken(localToken);
    }
  }, []);

  useEffect(() => {
    applyToken(token);

    if (token) {
      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey !== '/v1/users/me' &&
          query.queryKey !== '/v1/environments' &&
          query.queryKey !== '/v1/organizations',
      });
      const payload = jwtDecode<IJwtPayload>(token);
      setJwtPayload(payload);
    }
  }, [token]);

  useEffect(() => {
    if (user && organization) {
      Sentry.setUser({
        email: user.email,
        username: `${user.firstName} ${user.lastName}`,
        id: user._id,
        organizationId: organization._id,
        organizationName: organization.name,
      });
    } else {
      Sentry.configureScope((scope) => scope.setUser(null));
    }
  }, [user, organization]);

  const logout = () => {
    setToken(null);
    queryClient.clear();
    navigate('/auth/login');
  };

  return {
    isLoggedIn,
    user,
    organizations,
    organization,
    setToken,
    token,
    logout,
    jwtPayload,
  };
}
