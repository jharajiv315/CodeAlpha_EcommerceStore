-- Drop old constraint first
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Migrate existing orders from usr_alex_01 to Supabase Alex UUID
UPDATE orders
SET user_id = '35aed916-16f4-4bc4-b198-e689e6d5e59e'
WHERE user_id = 'usr_alex_01';

-- Now add foreign key constraint pointing to profiles(id)
ALTER TABLE orders
  ADD CONSTRAINT orders_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Drop old users table
DROP TABLE IF EXISTS users CASCADE;
