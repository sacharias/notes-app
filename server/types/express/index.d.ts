declare namespace Express {
  interface Request {
    user: {
      email: string;
      user_id: number;
    };
  }
}
