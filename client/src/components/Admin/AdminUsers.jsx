import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  fetchAllUsers,
  deleteUserById,
  updateUserById,
  banUserById,
  unbanUserById,
} from "../../services/adminUserService";
import ConfirmModal from "../../components/ConfirmModal";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AdminUserProfileTab from "./AdminUserProfileTab";
import BanUserModal from "../../components/Admin/BanUserModal";

const USERS_PER_PAGE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banTargetId, setBanTargetId] = useState(null);

  // Search, Filter, Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();

        const now = new Date();
        const updated = data.map((user) => {
          if (user.ban?.isBanned && new Date(user.ban.bannedUntil) < now) {
            return {
              ...user,
              ban: {
                isBanned: false,
                bannedUntil: null,
                reason: "",
              },
            };
          }
          return user;
        });

        setUsers(updated);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    loadUsers();

    const intervalId = setInterval(loadUsers, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const openBanModal = (userId) => {
    setBanTargetId(userId);
    setShowBanModal(true);
  };

  const handleBanConfirm = async ({ reason, bannedUntil }) => {
    try {
      await banUserById(banTargetId, { reason, bannedUntil });
      toast.success("User banned");
      setUsers(await fetchAllUsers());
    } catch (err) {
      toast.error("Failed to ban user");
    } finally {
      setShowBanModal(false);
    }
  };

  const handleUnban = async (userId) => {
    try {
      await unbanUserById(userId);
      toast.success("User unbanned");
      setUsers(await fetchAllUsers());
    } catch (err) {
      toast.error("Failed to unban user");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const handleSave = async (id) => {
    try {
      await updateUserById(id, formData);
      toast.success("User updated");
      setEditingUserId(null);
      const updatedUsers = await fetchAllUsers();
      setUsers(updatedUsers);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUserById(deleteTargetId);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== deleteTargetId));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <motion.div
      className="p-4 sm:p-6 bg-white/80 backdrop-blur rounded-xl shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-[#1C2B33] mb-4 outfit">
        👥 User Management
      </h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md w-full sm:w-1/2"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md w-full sm:w-48"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#ECEFF1] text-left text-[#37474F]">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <motion.tr
                key={u._id}
                className="border-t bg-white hover:bg-[#F5F5F5] transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td className="p-3">
                  {editingUserId === u._id ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td className="p-3">
                  {editingUserId === u._id ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td className="p-3">
                  {editingUserId === u._id ? (
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td className="p-3">
                  {u.ban?.isBanned &&
                  new Date(u.ban.bannedUntil) > new Date() ? (
                    <span className="text-red-600 font-semibold">
                      Banned (until{" "}
                      {new Date(u.ban.bannedUntil).toLocaleString()})
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                  {editingUserId === u._id ? (
                    <button
                      onClick={() => handleSave(u._id)}
                      className="text-green-600 hover:text-green-800 cursor-pointer"
                      title="Save"
                    >
                      ✅
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="text-[#00838F] hover:text-[#006064] cursor-pointer"
                        title="View"
                        onClick={() => setSelectedUserId(u._id)}
                      >
                        <FaEye />
                      </button>
                      {u.ban?.isBanned ? (
                        <button
                          onClick={() => handleUnban(u._id)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() => openBanModal(u._id)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          Ban
                        </button>
                      )}
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-full text-sm ${
              currentPage === i + 1
                ? "bg-[#00ACC1] text-white"
                : "bg-gray-100 text-[#37474F]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {selectedUserId && <AdminUserProfileTab userId={selectedUserId} />}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete this user?"
        message="Are you sure you want to remove this user? This action cannot be undone."
      />

      <BanUserModal
        open={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanConfirm}
      />
    </motion.div>
  );
};

export default AdminUsers;
