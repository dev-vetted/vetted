export type AuthInfo = {
  userId: string | null;
  tenantId: string | null;
};

export function getAuth(req: Request): AuthInfo {
  const userId = req.headers.get('x-user-id');
  const tenantId = req.headers.get('x-tenant-id');
  return {
    userId: userId && userId.length > 0 ? userId : null,
    tenantId: tenantId && tenantId.length > 0 ? tenantId : null,
  };
}


