import { Router } from "express";
import { registerUser, loginUser, getAllUsers, getUserById, blockUser } from "../controllers/user-controller.ts";
import { authenticateToken, authorizeRoles, isOwnerOrAdmin } from "../middleware/auth-middleware.ts";
import { UserRole } from "../types/app.types.ts";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - dateOfBirth
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Ivan Ivanov
 *                 description: Full name of the user
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-15
 *                 description: Date of birth in YYYY-MM-DD format
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan.ivanov@example.com
 *                 description: Unique email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ssw0rd!
 *                 description: User password (min 6 characters)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь успешно зарегистрирован.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: numeric
 *                       example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *                     fullName:
 *                       type: string
 *                       example: "Ivan Ivanov"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-15"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "ivan.ivanov@example.com"
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       example: "user"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email must be a valid email"
 *       409:
 *         description: Conflict (user with email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь с таким email уже существует."
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authorize user and get JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan.ivanov@example.com
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ssw0rd!
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Успешный вход."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: numeric
 *                     fullName:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                     isActive:
 *                       type: boolean
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: Unauthorized (invalid credentials or inactive user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Неверные учетные данные или пользователь неактивен."
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: numeric
 *                   fullName:
 *                     type: string
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                   email:
 *                     type: string
 *                     format: email
 *                   role:
 *                     type: string
 *                     enum: [user, admin]
 *                   isActive:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not admin)
 */
router.get("/", authenticateToken, authorizeRoles([UserRole.Admin]), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin or user themselves)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: numeric
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: numeric
 *                 fullName:
 *                   type: string
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                 email:
 *                   type: string
 *                   format: email
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not admin and not self)
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticateToken, isOwnerOrAdmin, getUserById);

/**
 * @swagger
 * /users/{id}/block:
 *   patch:
 *     summary: Block a user (Admin or user self-deactivation)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: numeric
 *         required: true
 *         description: The user ID to block or self-deactivate
 *     responses:
 *       200:
 *         description: User successfully blocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь успешно заблокирован."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: numeric
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not admin and not self, or trying to block an admin)
 *       404:
 *         description: User not found
 */
router.patch("/:id/block", authenticateToken, isOwnerOrAdmin, blockUser);

export default router;
