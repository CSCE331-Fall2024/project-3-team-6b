import { Router } from 'express';
import passport from '../auth'
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      logout(callback: (err: any) => void): void;
    }
  }
}

export {};


const router = Router();

// Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.FRONTEND_URL, // Redirect to frontend
    failureRedirect: '/auth/failure',
  })
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect(process.env.FRONTEND_URL!); // Redirect to frontend
  });
});

export default router;
