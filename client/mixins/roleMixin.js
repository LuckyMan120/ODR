import {userRole, orgRole} from '@/constants/index.js';

export const roleMixin = {
  data: () => ({
    userRole,
    orgRole
  })
};
