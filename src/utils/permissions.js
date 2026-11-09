export const Permissions = {
  ALL: -1,
  LIST_CLIENTS: 1,
  ADD_NEW_CLIENT: 2,
  DELETE_CLIENT: 4,
  UPDATE_CLIENTS: 8,
  FIND_CLIENT: 16,
  TRANSACTIONS: 32,
  MANAGE_USERS: 64,
  LOGIN_REGISTER_SCREEN: 128,
};


export function getUser() {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}


export function hasPermission(permission) {
  const user = getUser();
  if (!user) return false;
  if (user.permissions === Permissions.ALL) return true;
  return (permission & user.permissions) === permission;
}



export function permissionNames(mask) {
  if (mask === Permissions.ALL) return "All";
  return (
    Object.entries(Permissions)
      .filter(([, value]) => value > 0 && (value & mask) === value)
      .map(([name]) => name)
      .join(", ") || "None"
  );
}