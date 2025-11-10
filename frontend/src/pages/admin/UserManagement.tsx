import { useEffect, useState } from 'react';
import {
  listUsers,
  User,
  updateUser,
  softDeleteUser,
  restoreUser,
  listOrganizations,
  Organization,
  listOrganizationInvites,
  OrganizationInvite,
  createOrganizationInvite,
} from '../../services/api/admin';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('basic_member');
  const [invitePlaybookFocus, setInvitePlaybookFocus] = useState('pmi-stability-sprint');
  const [inviteNote, setInviteNote] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteStatusMessage, setInviteStatusMessage] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const perPage = 20;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await listUsers(page, perPage, search || undefined);
      setUsers(data.items);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    try {
      const data = await listOrganizations(1, 50);
      setOrganizations(data.items);
      if (!selectedOrgId && data.items.length > 0) {
        setSelectedOrgId(data.items[0].id);
      }
    } catch (err) {
      console.error('Failed to load organizations', err);
    }
  };

  const fetchInvites = async (orgId: string) => {
    if (!orgId) {
      setInvites([]);
      return;
    }
    try {
      setInvitesLoading(true);
      const data = await listOrganizationInvites(orgId);
      setInvites(data.items);
    } catch (err) {
      console.error('Failed to load invites', err);
      setInvites([]);
    } finally {
      setInvitesLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      fetchInvites(selectedOrgId);
    }
  }, [selectedOrgId]);

  useEffect(() => {
    if (!inviteStatusMessage) {
      return;
    }
    const timer = setTimeout(() => setInviteStatusMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [inviteStatusMessage]);

  const handleUpdateRole = async (userId: string) => {
    if (!newRole) return;

    try {
      await updateUser(userId, { role: newRole });
      setEditingUser(null);
      setNewRole('');
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action can be reversed.')) return;

    try {
      await softDeleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleRestoreUser = async (userId: string) => {
    try {
      await restoreUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to restore user');
    }
  };

  const handleSendInvite = async () => {
    if (!selectedOrgId) {
      setInviteError('Select an organization before sending invitations.');
      return;
    }
    if (!inviteEmail) {
      setInviteError('Enter an email address to invite.');
      return;
    }
    setInviteSubmitting(true);
    setInviteError(null);
    try {
      await createOrganizationInvite(selectedOrgId, {
        email: inviteEmail,
        role: inviteRole,
        playbook_focus: invitePlaybookFocus,
        note: inviteNote || undefined,
      });
      setInviteEmail('');
      setInviteNote('');
      setInviteStatusMessage('Invitation sent using the PMI onboarding playbook.');
      fetchInvites(selectedOrgId);
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? err?.message ?? 'Failed to send invite';
      setInviteError(detail);
    } finally {
      setInviteSubmitting(false);
    }
  };

  const selectedOrgName = organizations.find((org) => org.id === selectedOrgId)?.name ?? 'the selected organization';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: '#dc2626',
      enterprise: '#7c3aed',
      growth: '#2563eb',
      solo: '#64748b',
      community_leader: '#f59e0b',
    };
    return colors[role as keyof typeof colors] || '#64748b';
  };

  return (
    <section data-testid="admin-users" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>User Management</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {total} total users across all organizations
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by email, name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem',
            minWidth: '280px',
          }}
        />
      </header>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Invite teammates with PMI guardrails</h2>
            <p style={{ color: '#475569', marginTop: '0.25rem' }}>
              Every invitation bundles the Post Merger Integration Toolkit context so new members land in the right sprint
              (Stability → Quick Wins → Revenue → Enablement).
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              marginBottom: '1rem',
            }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#475569' }}>
              Organization
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <option value="">Select organization…</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.subscription_tier})
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#475569' }}>
              Email address
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="ops.lead@example.com"
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#475569' }}>
              Role
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <option value="basic_member">Workspace Member</option>
                <option value="admin">Organization Admin</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#475569' }}>
              PMI Playbook Focus
              <select
                value={invitePlaybookFocus}
                onChange={(e) => setInvitePlaybookFocus(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <option value="pmi-stability-sprint">Sprint 0 · Stability & Protection</option>
                <option value="pmi-quick-win">Sprint 1 · Quick-Win Cost Capture</option>
                <option value="pmi-revenue-acceleration">Sprint 2 · Revenue Acceleration</option>
                <option value="pmi-enablement">Sprint 3 · Enablement & Culture</option>
              </select>
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#475569' }}>
            Personal note (optional)
            <textarea
              value={inviteNote}
              onChange={(e) => setInviteNote(e.target.value)}
              placeholder="Highlight integration focus, e.g., “Own Sprint 0 document readiness tasks.”"
              rows={3}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'vertical' }}
            />
          </label>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleSendInvite}
              disabled={inviteSubmitting || !selectedOrgId || !inviteEmail}
              style={{
                alignSelf: 'flex-start',
                background: inviteSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #312e81, #6366f1)',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                cursor: inviteSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {inviteSubmitting ? 'Sending…' : 'Send invite'}
            </button>
            {inviteError && (
              <span style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{inviteError}</span>
            )}
            {inviteStatusMessage && (
              <span style={{ color: '#047857', fontSize: '0.85rem' }}>{inviteStatusMessage}</span>
            )}
          </div>
        </article>

        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
          }}
        >
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Pending invitations</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Tracking invites for {selectedOrgName}. Align messaging with PMI/M&A toolkit copy for consistent onboarding.
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#475569' }}>
              {invites.length} pending
            </span>
          </header>
          {invitesLoading ? (
            <div style={{ padding: '1rem', color: '#64748b' }}>Loading invitations…</div>
          ) : invites.length === 0 ? (
            <div style={{ padding: '1rem', color: '#94a3b8' }}>No pending invites for this organization.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#475569' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#475569' }}>Role</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#475569' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#475569' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#0f172a' }}>{invite.email}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#475569', textTransform: 'capitalize' }}>{invite.role.replace('_', ' ')}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: invite.status === 'pending' ? '#b45309' : '#047857' }}>
                        {invite.status}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                        {new Date(invite.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading users...
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', color: '#991b1b' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    User
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Role
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Organization
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Created
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Last Active
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {user.first_name} {user.last_name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {editingUser?.id === user.id ? (
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            style={{
                              padding: '0.5rem',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.875rem',
                            }}
                          >
                            <option value="">Select role...</option>
                            <option value="solo">Solo</option>
                            <option value="growth">Growth</option>
                            <option value="enterprise">Enterprise</option>
                            <option value="community_leader">Community Leader</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'white',
                              background: getRoleBadgeColor(user.role),
                              textTransform: 'capitalize',
                            }}
                          >
                            {user.role.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {user.organization_id ? user.organization_id.substring(0, 8) + '...' : 'None'}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {formatDate(user.created_at)}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {formatDate(user.last_active_at)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.deleted_at ? (
                          <span style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }}>
                            Deleted
                          </span>
                        ) : (
                          <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 600 }}>
                            Active
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {editingUser?.id === user.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateRole(user.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: '#16a34a',
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(null);
                                  setNewRole('');
                                }}
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#64748b',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setNewRole(user.role);
                                }}
                                disabled={!!user.deleted_at}
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  background: user.deleted_at ? '#f1f5f9' : 'white',
                                  color: user.deleted_at ? '#94a3b8' : '#0f172a',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: user.deleted_at ? 'not-allowed' : 'pointer',
                                }}
                              >
                                Edit Role
                              </button>
                              {user.deleted_at ? (
                                <button
                                  onClick={() => handleRestoreUser(user.id)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#16a34a',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#dc2626',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > perPage && (
            <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total} users
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: page === 1 ? '#f1f5f9' : 'white',
                    color: page === 1 ? '#94a3b8' : '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * perPage >= total}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: page * perPage >= total ? '#f1f5f9' : 'white',
                    color: page * perPage >= total ? '#94a3b8' : '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: page * perPage >= total ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </article>
      )}
    </section>
  );
};
