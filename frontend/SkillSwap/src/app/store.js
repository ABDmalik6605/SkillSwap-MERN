import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import usersReducer from '../features/users/usersSlice.js';
import discoverReducer from '../features/discover/discoverSlice.js';
import skillsReducer from '../features/skills/skillsSlice.js';
import requestsReducer from '../features/requests/requestsSlice.js';
import bookingsReducer from '../features/bookings/bookingsSlice.js';
import chatReducer from '../features/chat/chatSlice.js';
import reviewsReducer from '../features/reviews/reviewsSlice.js';
import blogsReducer from '../features/blogs/blogsSlice.js';
import creditsReducer from '../features/credits/creditsSlice.js';
import notificationsReducer from '../features/notifications/notificationsSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    discover: discoverReducer,
    skills: skillsReducer,
    requests: requestsReducer,
    bookings: bookingsReducer,
    chat: chatReducer,
    reviews: reviewsReducer,
    blogs: blogsReducer,
    credits: creditsReducer,
    notifications: notificationsReducer
  }
});

export default store;
