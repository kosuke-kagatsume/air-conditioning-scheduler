# Supabase セットアップガイド 📧

## 開発環境での設定

### 1. メール確認を無効にする（開発用）

開発中はメール確認をスキップできます：

1. **Supabaseダッシュボード**にアクセス
   - https://supabase.com/dashboard/project/mbkmtazilqmkbqskrjwx

2. **Authentication** → **Providers** → **Email**

3. **Confirm email** を **OFF** にする
   - これで登録後すぐにログイン可能

### 2. テストユーザーの作成

#### 方法A: UIから直接作成（推奨）
1. Authentication → Users
2. 「Invite」ボタンをクリック
3. メールアドレスを入力して招待

#### 方法B: SQLで一括作成
```sql
-- Supabase SQL Editorで実行
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('admin@test.com', crypt('Admin123!', gen_salt('bf')), NOW(), '{"name": "管理者", "role": "admin"}'),
  ('manager1@test.com', crypt('Manager123!', gen_salt('bf')), NOW(), '{"name": "マネージャー1", "role": "manager1"}'),
  ('worker1@test.com', crypt('Worker123!', gen_salt('bf')), NOW(), '{"name": "作業者1", "role": "worker"}'),
  ('worker2@test.com', crypt('Worker123!', gen_salt('bf')), NOW(), '{"name": "作業者2", "role": "worker"}'),
  ('viewer@test.com', crypt('Viewer123!', gen_salt('bf')), NOW(), '{"name": "閲覧者", "role": "viewer"}');
```

### 3. データベーステーブルの作成

```sql
-- イベントテーブル
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  end_date DATE,
  start_time TIME NOT NULL,
  end_time TIME,
  status TEXT DEFAULT 'pending',
  address TEXT,
  city TEXT,
  construction_type TEXT,
  client_name TEXT,
  constructor_name TEXT,
  worker_id UUID REFERENCES auth.users(id),
  worker_name TEXT,
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS（Row Level Security）の設定
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成（全ユーザーが自分のイベントを見れる）
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = worker_id OR auth.uid() = created_by);

-- ポリシーの作成（認証済みユーザーがイベントを作成できる）
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- ポリシーの作成（作成者が自分のイベントを更新できる）
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);
```

### 4. リアルタイム機能の有効化

1. **Database** → **Replication**
2. テーブルを選択して「Enable Replication」

### 5. ストレージバケットの作成（画像アップロード用）

```sql
-- ストレージバケット作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);
```

## トラブルシューティング

### エラー: "Password should be at least 6 characters"
- パスワードは最低6文字必要です
- 大文字・小文字・数字を含めることを推奨

### エラー: "User already registered"
- 既に登録済みのメールアドレスです
- パスワードリセットを使用するか、別のメールで登録

### エラー: "Invalid login credentials"  
- メールアドレスまたはパスワードが間違っています
- メール確認が必要な場合があります（設定による）

### メール確認メールが届かない
1. 開発環境：メール確認を無効化（上記参照）
2. 本番環境：SMTPサービスの設定が必要
   - Settings → Auth → SMTP Settings
   - SendGrid、Mailgun等を設定

## 環境変数

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://mbkmtazilqmkbqskrjwx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 本番環境では以下も設定
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 次のステップ

1. ✅ ユーザー認証機能
2. ⏳ データベーススキーマ作成
3. ⏳ CRUD API実装
4. ⏳ リアルタイム同期
5. ⏳ ファイルアップロード