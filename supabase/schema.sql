-- ===================================
-- エアコンスケジューラー データベーススキーマ
-- ===================================

-- 1. イベントテーブル
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  end_date DATE,
  start_time TIME NOT NULL,
  end_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  address TEXT,
  city TEXT,
  construction_type TEXT,
  client_name TEXT,
  constructor_name TEXT,
  worker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  worker_name TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- インデックスの作成
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_worker_id ON events(worker_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_status ON events(status);

-- 2. RLS（Row Level Security）の設定
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが自分に関連するイベントを見れる
CREATE POLICY "Users can view related events" ON events
  FOR SELECT USING (
    auth.uid() = worker_id 
    OR auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND (raw_user_meta_data->>'role' IN ('admin', 'manager1', 'manager2'))
    )
  );

-- 認証済みユーザーがイベントを作成できる
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = created_by
  );

-- 作成者と管理者がイベントを更新できる
CREATE POLICY "Users can update events" ON events
  FOR UPDATE USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND (raw_user_meta_data->>'role' IN ('admin', 'manager1'))
    )
  );

-- 作成者と管理者がイベントを削除できる
CREATE POLICY "Users can delete events" ON events
  FOR DELETE USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 3. リアルタイム用のトリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. ユーザープロファイルテーブル（オプション）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'manager1', 'manager2', 'worker', 'viewer')),
  phone TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- プロファイルのRLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のプロファイルを見れる
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- ユーザーは自分のプロファイルを更新できる
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 新規ユーザー作成時に自動的にプロファイルを作成
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'worker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- 5. コメントテーブル（イベントへのコメント）
CREATE TABLE IF NOT EXISTS event_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- コメントのRLS
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

-- イベントに関連するユーザーがコメントを見れる
CREATE POLICY "View comments on related events" ON event_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_comments.event_id
      AND (
        auth.uid() = events.worker_id 
        OR auth.uid() = events.created_by
        OR EXISTS (
          SELECT 1 FROM auth.users 
          WHERE auth.uid() = id 
          AND (raw_user_meta_data->>'role' IN ('admin', 'manager1', 'manager2'))
        )
      )
    )
  );

-- 認証済みユーザーがコメントを作成できる
CREATE POLICY "Create comments on related events" ON event_comments
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- 6. ストレージバケットの作成（画像アップロード用）
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- ストレージのポリシー
CREATE POLICY "Anyone can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'event-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'event-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );