import jwt, { type SignOptions } from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import config from '../config';
import { ApiError } from '../middleware/errorHandler';

/**
 * User registration data interface
 */
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * Login data interface
 */
interface LoginData {
  email: string;
  password: string;
}

/**
 * Auth response interface
 */
interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

/**
 * Auth Service
 * Handles user authentication and registration
 */
class AuthService {
  /**
   * Generate JWT token for user
   * @param user - User document
   * @returns JWT token string
   */
  private generateToken(user: IUser): string {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    
    const options: SignOptions = { 
      expiresIn: '7d'
    };
    
    return jwt.sign(payload, config.jwtSecret, options);
  }

  /**
   * Register a new user
   * @param data - Registration data
   * @returns AuthResponse with user and token
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const { name, email, password, role } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || UserRole.USER
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Login user
   * @param data - Login credentials
   * @returns AuthResponse with user and token
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User document or null
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}

export default new AuthService();
