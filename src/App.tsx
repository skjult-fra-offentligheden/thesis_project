import { useState } from 'react';
import { Layout, type NavKey } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { CreateUser } from './screens/CreateUser';
import { ManageTeam } from './screens/ManageTeam';
import { Fleets } from './screens/Fleets';
import { Login } from './screens/Login';
import { existingUsers } from './data/users';
import { fleets as initialFleets } from './data/fleets';
import type { User } from './types/users';
import type { Fleet } from './data/fleets';

export function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState<NavKey>('dashboard');
  const [users, setUsers] = useState<User[]>(existingUsers);
  const [fleets, setFleets] = useState<Fleet[]>(initialFleets);

  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function addUser(user: User) {
    setUsers((prev) => [...prev, user]);
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Layout active={active} onNavigate={setActive} onLogout={() => setLoggedIn(false)}>
      {active === 'dashboard' && <Dashboard />}
      {active === 'create-user' && <CreateUser onUserCreated={addUser} />}
      {active === 'manage-team' && (
        <ManageTeam users={users} onDelete={deleteUser} />
      )}
      {active === 'fleets' && (
        <Fleets fleets={fleets} onFleetsChange={setFleets} users={users} />
      )}
    </Layout>
  );
}
