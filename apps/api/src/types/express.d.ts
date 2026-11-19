declare namespace Express {
  interface User {
    id: string;
    email: string;
    roleTypes: string[];
    permissions: string[];
  }

  interface Request {
    user?: User;
  }
}
