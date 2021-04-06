import {userRole} from '@/constants/index';

export default function({store, redirect}) {
  if (
    store.state.user.role.name !== userRole.admin &&
    store.state.user.role.name !== userRole.superadmin
  ) {
    redirect('/');
  }
}
