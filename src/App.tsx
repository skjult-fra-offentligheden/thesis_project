import { useState } from 'react';
import { Layout, type NavKey } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { CreateUser } from './screens/CreateUser';
import { ManageTeam } from './screens/ManageTeam';
import { Login } from './screens/Login';
import { existingUsers } from './data/users';
import type { User } from './types/users';

export function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState<NavKey>('dashboard');
  const [users, setUsers] = useState<User[]>(existingUsers);

  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Layout active={active} onNavigate={setActive} onLogout={() => setLoggedIn(false)}>
      {active === 'dashboard' && <Dashboard />}
      {active === 'create-user' && <CreateUser />}
      {active === 'manage-team' && (
        <ManageTeam users={users} onDelete={deleteUser} />
      )}
    </Layout>
  );
}
