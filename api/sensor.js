// Vercel Serverless Function
// Konversi dari Cloudflare Pages Function ke Vercel API Route

export default async function handler(req, res) {
  // 1. Tangani CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Jika request berupa OPTIONS (preflight), langsung kembalikan status 200
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 2. Proteksi: Hanya izinkan metode POST untuk pengiriman data IoT
  if (req.method !== "POST") {
    return res.status(405).send("Metode tidak diizinkan. Gunakan POST.");
  }

  try {
    // 3. Ambil dan validasi data JSON dari ESP32
    const data = req.body;

    // ESP32 mengirimkan data dengan format: {"bac": 0.05}
    if (data.bac === undefined) {
      return res.status(400).json({ error: "Format data salah. Kunci 'bac' diperlukan." });
    }

    // 4. Ambil Kredensial Supabase dari Environment Variables Vercel
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: "Environment variables SUPABASE_URL atau SUPABASE_KEY belum diset." });
    }

    // 5. Tembak REST API Supabase untuk melakukan INSERT ke tabel 'alcohol_logs'
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/alcohol_logs`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        bac_value: parseFloat(data.bac)
      })
    });

    // Jika Supabase menolak data
    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      return res.status(500).send(`Supabase Error: ${errorText}`);
    }

    // 6. Respon balik ke ESP32 bahwa data berhasil dijembatani
    return res.status(200).json({ success: true, message: "Data terkirim ke Supabase" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
