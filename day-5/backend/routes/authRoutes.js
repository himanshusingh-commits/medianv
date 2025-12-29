import {Router} from 'express'
import { signup,login, getDetails } from '../controller/authController.js'

import {authentication,authRole} from '../middleware/authMiddleware.js'

const router = Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/profile').get(authentication,getDetails)
router.get('/admin-dashboard', authentication, authRole('admin'), (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard" });
});
export default router