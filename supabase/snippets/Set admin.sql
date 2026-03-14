UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users LIMIT 1);
