export const ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isInstructor = (user) => user?.role === ROLES.INSTRUCTOR;
export const isStudent = (user) => user?.role === ROLES.STUDENT;
