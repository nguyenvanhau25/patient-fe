import React from 'react';
import { Search, Filter, MoreVertical, Shield, ShieldAlert, ShieldCheck, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../utils/AuthContext';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user } = useAuth();
  const { data: usersRaw, loading, error, execute: fetchUsers } = useApi(
    () => authApi.getAllUsers(),
    true
  );

  const users = Array.isArray(usersRaw) ? usersRaw : (usersRaw?.data || []);

  const getRoleIcon = (role) => {
    if (role?.includes('ADMIN')) return <ShieldAlert size={14} />;
    if (role?.includes('DOCTOR')) return <ShieldCheck size={14} />;
    return <Shield size={14} />;
  };

  const getRoleBadgeClass = (role) => {
    if (role?.includes('ADMIN')) return 'role-admin';
    if (role?.includes('DOCTOR')) return 'role-doctor';
    return 'role-user';
  };

  // Hiển thị lỗi 403 thân thiện hơn
  const friendlyError = error?.includes('403') || error?.includes('Forbidden')
    ? 'Bạn không có quyền xem danh sách người dùng. Chỉ tài khoản ADMIN mới có quyền này.'
    : error;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="users-container container mt-4">
      <div className="flex-between m-b-2">
        <div>
          <h1>Quản lý Hệ thống & User</h1>
          <p className="text-muted">Quản lý tài khoản, phân quyền và trạng thái truy cập.</p>
        </div>
        <button className="btn-primary">
          <UserPlus size={18} /> <span>Thêm User mới</span>
        </button>
      </div>

      <div className="card glass users-table-container">
        <div className="table-header-actions p-4">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Tìm tên, email hoặc role..." />
          </div>
          <button className="btn-secondary">
            <Filter size={18} /> <span>Bộ lọc</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8"><LoadingState message="Đang tải danh sách người dùng..." /></div>
        ) : friendlyError ? (
          <div className="p-8">
            <EmptyState
              isError
              title="Không thể tải dữ liệu"
              message={friendlyError}
              onAction={fetchUsers}
              actionLabel="Thử lại"
            />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8"><EmptyState title="Trống" message="Chưa có người dùng nào trong hệ thống." /></div>
        ) : (
          <div className="table-responsive">
            <table className="users-table w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left">Người dùng</th>
                  <th className="px-6 py-4 text-left">Vai trò</th>
                  <th className="px-6 py-4 text-left">Trạng thái</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="px-6 py-4">
                      <div className="user-info-cell flex items-center gap-3">
                        <div className="user-avatar w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                          {(u.fullName || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="name font-bold text-slate-800">{u.fullName || 'N/A'}</div>
                          <div className="email text-sm text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`badge-role ${getRoleBadgeClass(u.role)} flex items-center gap-1.5 px-2 py-1 rounded-md text-sm w-fit`}>
                        {getRoleIcon(u.role)}
                        {u.role || 'USER'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="status-badge active px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-600 font-medium">
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="btn-icon p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminUsers;