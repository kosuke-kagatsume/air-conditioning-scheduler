-- ===================================
-- 5人分のテストユーザー作成
-- ===================================

-- 注意: Supabase Dashboardで実行する前に、
-- Authentication → Providers → Email で
-- "Confirm email" を OFF にしてください

-- テストユーザーの作成
DO $$
DECLARE
  user_id1 UUID;
  user_id2 UUID;
  user_id3 UUID;
  user_id4 UUID;
  user_id5 UUID;
BEGIN
  -- 1. 管理者 (Admin)
  INSERT INTO auth.users (
    id,
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    'admin@test.com', 
    crypt('Admin123!', gen_salt('bf')), 
    NOW(), 
    '{"name": "山田太郎", "role": "admin", "department": "システム管理部"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO user_id1;

  -- 2. マネージャー1
  INSERT INTO auth.users (
    id,
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    'manager1@test.com', 
    crypt('Manager123!', gen_salt('bf')), 
    NOW(), 
    '{"name": "佐藤花子", "role": "manager1", "department": "工事管理部"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO user_id2;

  -- 3. マネージャー2
  INSERT INTO auth.users (
    id,
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    'manager2@test.com', 
    crypt('Manager123!', gen_salt('bf')), 
    NOW(), 
    '{"name": "鈴木一郎", "role": "manager2", "department": "施工管理部"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO user_id3;

  -- 4. 作業者1
  INSERT INTO auth.users (
    id,
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    'worker1@test.com', 
    crypt('Worker123!', gen_salt('bf')), 
    NOW(), 
    '{"name": "田中次郎", "role": "worker", "department": "施工部"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO user_id4;

  -- 5. 作業者2
  INSERT INTO auth.users (
    id,
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    'worker2@test.com', 
    crypt('Worker123!', gen_salt('bf')), 
    NOW(), 
    '{"name": "高橋三郎", "role": "worker", "department": "施工部"}'::jsonb,
    NOW(),
    NOW()
  )
  RETURNING id INTO user_id5;

  -- ユーザー確認用メッセージ
  RAISE NOTICE 'テストユーザーが正常に作成されました';
  RAISE NOTICE 'admin@test.com (Password: Admin123!)';
  RAISE NOTICE 'manager1@test.com (Password: Manager123!)';
  RAISE NOTICE 'manager2@test.com (Password: Manager123!)';
  RAISE NOTICE 'worker1@test.com (Password: Worker123!)';
  RAISE NOTICE 'worker2@test.com (Password: Worker123!)';
END $$;

-- 作成されたユーザーの確認
SELECT 
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'department' as department,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email IN (
  'admin@test.com',
  'manager1@test.com', 
  'manager2@test.com',
  'worker1@test.com',
  'worker2@test.com'
)
ORDER BY created_at DESC;