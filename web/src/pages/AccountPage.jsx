import { useCallback, useRef } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PurchasesPanel from '../components/account/PurchasesPanel';
import AccountDataPanel from '../components/account/AccountDataPanel';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

const accountTabs = [
  { key: 'compras', label: 'Compras' },
  { key: 'dados', label: 'Dados da conta' },
];

export default function AccountPage() {
  usePageTitle('Minha conta');
  const { currentUser, isAuthenticated, signOut, updateCurrentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabRefs = useRef([]);
  const activeTabKey = accountTabs.some((accountTab) => accountTab.key === searchParams.get('aba'))
    ? searchParams.get('aba')
    : 'compras';

  // A API em memória pode reiniciar: sessão local órfã → volta para o login
  const handleUserNotFound = useCallback(() => {
    signOut();
    toast.error('Sua sessão expirou. Entre ou crie a conta novamente.');
    navigate('/login?redirect=/minha-conta', { replace: true });
  }, [signOut, navigate]);

  if (!isAuthenticated) return <Navigate to="/login?redirect=/minha-conta" replace />;

  const selectTab = (tabKey) => setSearchParams({ aba: tabKey }, { replace: true });

  const handleTabKeyDown = (event, tabIndex) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
    const nextTabIndex = (tabIndex + direction + accountTabs.length) % accountTabs.length;
    selectTab(accountTabs[nextTabIndex].key);
    tabRefs.current[nextTabIndex]?.focus();
  };

  const handleSignOut = () => {
    signOut();
    toast.success('Você saiu da conta');
    navigate('/');
  };

  const initials = currentUser.name.split(' ').map((namePart) => namePart[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="container page">
      <h1 className="visually-hidden">Minha conta</h1>
      <div className="account-layout">
        <aside className="filters" aria-label="Menu da conta">
          <div className="profile">
            <div className="avatar" aria-hidden="true">{initials}</div>
            <div>
              <p className="profile-name">{currentUser.name}</p>
              <p className="profile-email">{currentUser.email}</p>
            </div>
          </div>
          <div className="tab-list" role="tablist" aria-orientation="vertical" aria-label="Seções da conta">
            {accountTabs.map((accountTab, tabIndex) => (
              <button
                key={accountTab.key}
                ref={(tabElement) => { tabRefs.current[tabIndex] = tabElement; }}
                type="button"
                role="tab"
                id={`tab-${accountTab.key}`}
                className="tab"
                aria-selected={activeTabKey === accountTab.key}
                aria-controls={`panel-${accountTab.key}`}
                tabIndex={activeTabKey === accountTab.key ? 0 : -1}
                onClick={() => selectTab(accountTab.key)}
                onKeyDown={(event) => handleTabKeyDown(event, tabIndex)}
              >
                {accountTab.label}
              </button>
            ))}
          </div>
          <button type="button" className="tab" onClick={handleSignOut} style={{ width: '100%' }}>Sair</button>
        </aside>

        <section id={`panel-${activeTabKey}`} role="tabpanel" aria-labelledby={`tab-${activeTabKey}`} tabIndex={0}>
          {activeTabKey === 'compras'
            ? <PurchasesPanel userId={currentUser.id} onUserNotFound={handleUserNotFound} />
            : (
              <AccountDataPanel
                currentUser={currentUser}
                onUserUpdated={updateCurrentUser}
                onUserNotFound={handleUserNotFound}
              />
            )}
        </section>
      </div>
    </div>
  );
}
