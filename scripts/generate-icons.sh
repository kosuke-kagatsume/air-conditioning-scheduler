#!/bin/bash

# SVGからPNGアイコンを生成するスクリプト

echo "🎨 アイコン生成を開始します..."

cd /Users/dw100/Documents/air-conditioning-scheduler-latest

# Node.jsを使用してSVGをPNGに変換
cat > /tmp/svg-to-png.js << 'EOF'
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// SVGの内容
const svgContent = `<svg width="512" height="512" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="url(#gradient)"/>
  <path d="M20 24h24v4H20zM20 32h18v4H20zM20 40h24v4H20z" fill="white" opacity="0.9"/>
  <circle cx="48" cy="34" r="8" fill="white" opacity="0.95"/>
  <path d="M47 34.5l-1.5-1.5L44 34.5l3 3 5-5-1.5-1.5z" fill="url(#gradient)" stroke="none"/>
  <defs>
    <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64">
      <stop offset="0%" stop-color="#FF6B6B"/>
      <stop offset="100%" stop-color="#4ECDC4"/>
    </linearGradient>
  </defs>
</svg>`;

// 簡易的なPNG生成（グラデーションをソリッドカラーで代替）
const sizes = [
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 }
];

sizes.forEach(({ name, size }) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 背景（グラデーション風）
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#FF6B6B');
  gradient.addColorStop(1, '#4ECDC4');
  ctx.fillStyle = gradient;
  
  // 角丸四角形
  const radius = size * 0.1875; // 12/64 = 0.1875
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.fill();
  
  // 白いライン（スケジュールを表現）
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const scale = size / 64;
  
  // 上のライン
  ctx.fillRect(20 * scale, 24 * scale, 24 * scale, 4 * scale);
  // 中のライン
  ctx.fillRect(20 * scale, 32 * scale, 18 * scale, 4 * scale);
  // 下のライン
  ctx.fillRect(20 * scale, 40 * scale, 24 * scale, 4 * scale);
  
  // チェックマークの円
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(48 * scale, 34 * scale, 8 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  // チェックマーク
  ctx.strokeStyle = '#4ECDC4';
  ctx.lineWidth = 2 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(44 * scale, 34 * scale);
  ctx.lineTo(47 * scale, 37 * scale);
  ctx.lineTo(52 * scale, 32 * scale);
  ctx.stroke();
  
  // PNGファイルとして保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/${name}`, buffer);
  console.log(`✅ ${name} (${size}x${size}) を生成しました`);
});

console.log('🎉 すべてのアイコンを生成しました！');
EOF

# canvasパッケージがない場合は、代替方法を使用
if ! npm list canvas > /dev/null 2>&1; then
  echo "⚠️ canvasパッケージがインストールされていません"
  echo "📝 代替方法: シンプルなPNGアイコンを作成します"
  
  # Python を使用した代替方法
  python3 << 'EOF'
import struct
import zlib

def create_simple_png(width, height, filename):
    """シンプルなグラデーションPNGを作成"""
    
    # RGBA画像データを作成
    raw_data = []
    for y in range(height):
        row = [0]  # フィルタータイプ（なし）
        for x in range(width):
            # グラデーション計算
            r = int(255 * (1 - x/width) * 0.42 + 255 * (x/width) * 0.31)  # FF6B6B to 4ECDC4
            g = int(107 * (1 - x/width) * 0.42 + 205 * (x/width) * 0.80)
            b = int(107 * (1 - x/width) * 0.42 + 196 * (x/width) * 0.77)
            a = 255
            row.extend([r, g, b, a])
        raw_data.extend(row)
    
    raw_data = bytes(raw_data)
    
    def make_chunk(chunk_type, data):
        chunk = chunk_type + data
        crc = zlib.crc32(chunk) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + chunk + struct.pack('>I', crc)
    
    # PNGヘッダー
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR チャンク
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += make_chunk(b'IHDR', ihdr)
    
    # IDAT チャンク（圧縮データ）
    compressor = zlib.compressobj()
    compressed = compressor.compress(raw_data)
    compressed += compressor.flush()
    png += make_chunk(b'IDAT', compressed)
    
    # IEND チャンク
    png += make_chunk(b'IEND', b'')
    
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"✅ {filename} ({width}x{height}) を生成しました")

# 各サイズのアイコンを生成
create_simple_png(512, 512, 'public/icon-512.png')
create_simple_png(192, 192, 'public/icon-192.png')
create_simple_png(180, 180, 'public/apple-touch-icon.png')
create_simple_png(32, 32, 'public/favicon-32.png')
create_simple_png(16, 16, 'public/favicon-16.png')

print("🎉 すべてのアイコンを生成しました！")
EOF
else
  node /tmp/svg-to-png.js
fi

# favicon.ico の作成（複数サイズを含む）
if [ -f public/favicon-16.png ] && [ -f public/favicon-32.png ]; then
  echo "📝 favicon.ico を作成中..."
  # sipsを使用してfavicon.icoを作成（macOS）
  if which sips > /dev/null 2>&1; then
    sips -s format ico public/favicon-32.png --out public/favicon.ico 2>/dev/null || echo "⚠️ favicon.ico の作成はスキップされました"
  fi
fi

echo "✅ アイコン生成が完了しました！"
ls -la public/*.png public/*.ico 2>/dev/null || true