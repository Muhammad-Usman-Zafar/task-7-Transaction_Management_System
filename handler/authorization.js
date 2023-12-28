const roles = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
  };
  
  const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Assuming the user role is stored in the request after authentication
  
      if (allowedRoles.includes(userRole)) {
        next(); // User has the required role, continue with the next middleware or route handler
      } else {
        return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
      }
    };
  };
  
  module.exports = { authorize, roles };