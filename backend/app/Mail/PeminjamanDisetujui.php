<div style="font-family: sans-serif; text-align: center; border: 2px solid #FFC2E2; padding: 20px; border-radius: 20px;">
    <h2 style="color: #DB2777;">Halo, {{ $loan->user->name }}! 🎀</h2>
    <p>Peminjaman buku <strong>{{ $loan->book->judul }}</strong> telah disetujui oleh Admin.</p>
    
    <p>Silakan tunjukkan QR Code di bawah ini ke Admin saat mengambil buku:</p>

    <div style="margin: 20px 0;">
        {!! QrCode::size(200)->generate($loan->id) !!}
    </div>

    <p style="background: #FFF9E6; padding: 10px;">
        📍 <strong>Lokasi Buku: {{ $loan->book->rak }}</strong>
    </p>

    <p>Batas pengembalian: <strong>{{ $loan->return_date }}</strong></p>
    <br>
    <p>Terima kasih sudah meminjam buku di Peminjaman Buku Tiara! ✨</p>
</div>