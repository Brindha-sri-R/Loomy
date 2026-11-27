import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || '',
    authProvider: user.authProvider || 'local',
  };
}

export async function registerUser(req, res, next) {
  try {
    if (!process.env.JWT_SECRET || !String(process.env.JWT_SECRET).trim()) {
      return res.status(500).json({
        message: 'Authentication service is not configured.',
      });
    }

    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({
        field: 'email',
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    let token;
    try {
      token = generateToken(user._id);
    } catch (tokenErr) {
      await User.findByIdAndDelete(user._id).catch(() => {});
      throw tokenErr;
    }

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function googleAuth(req, res, next) {
  try {
    if (!process.env.JWT_SECRET || !String(process.env.JWT_SECRET).trim()) {
      return res.status(500).json({
        message: 'Authentication service is not configured.',
      });
    }

    const googleClientId =
      process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (
      !googleClientId ||
      !String(googleClientId).trim() ||
      String(googleClientId).includes('your_google_client_id')
    ) {
      return res.status(503).json({
        message: 'Google Sign-In is not configured on the server.',
      });
    }

    const { credential } = req.body;
    const client = new OAuth2Client(googleClientId);

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({
        message: 'Invalid or expired Google credential.',
      });
    }

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        message: 'Google account email must be verified.',
      });
    }

    const normalizedEmail = payload.email.toLowerCase().trim();
    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: normalizedEmail }],
    });

    if (user) {
      let changed = false;
      if (!user.googleId) {
        user.googleId = payload.sub;
        changed = true;
      }
      if (payload.picture && !user.avatar) {
        user.avatar = payload.picture;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    } else {
      const displayName =
        (payload.name && payload.name.trim()) ||
        normalizedEmail.split('@')[0];
      user = await User.create({
        name: displayName.length >= 2 ? displayName : `${displayName} User`,
        email: normalizedEmail,
        authProvider: 'google',
        googleId: payload.sub,
        avatar: payload.picture || '',
      });
    }

    const token = generateToken(user._id);
    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function logoutUser(req, res) {
  return res.json({ message: 'Signed out successfully' });
}

export async function getMe(req, res) {
  return res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = req.body.name.trim();
    const updated = await user.save();

    return res.json({
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (err) {
    next(err);
  }
}
