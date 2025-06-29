/* ========= SMOOTH SCROLL & ACTIVE LINK ========= */
const menuLinks = document.querySelectorAll('ul.menu a');
const sections  = document.querySelectorAll('main section');

/* Highlight menu saat section aktif */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      menuLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { root: document.querySelector('main'), threshold: 0.6 });

sections.forEach(sec => observer.observe(sec));

/* Smooth scroll manual (supaya tetap halus di semua browser) */
menuLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
            .scrollIntoView({ behavior: 'smooth' });
  });
});

// buka link GitHub dari data-link
document.querySelectorAll('.btn-github').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const url = btn.dataset.link;
    if (url) window.open(url, '_blank', 'noopener');
  });
});

// === KONFIGURASI SUPABASE ===
const supabaseUrl = 'https://pnaenxtcbcqrncazotmv.supabase.co'; // URL Supabase Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuYWVueHRjYmNxcm5jYXpvdG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjUyNjAsImV4cCI6MjA2NjcwMTI2MH0.0P-WP4RuHErzfj4zDKBPq3lH3Bu8Fkl9gk7JH4TakH8'; // Kunci Anon Supabase Anda

// FIX: Inisialisasi client Supabase dengan cara yang benar
// Objek `supabase` berasal dari script CDN, kita ambil fungsi `createClient` darinya.
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// === HANDLE SUBMIT FORM KONTAK ===
const contactForm = document.getElementById('contactForm');
const contactMsg  = document.getElementById('contactMsg');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if(contactForm && submitButton){
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Nonaktifkan tombol untuk mencegah pengiriman ganda
    submitButton.disabled = true;
    submitButton.textContent = 'Mengirim...';

    const formData = new FormData(contactForm);
    const name     = formData.get('name');
    const email    = formData.get('email');
    const message  = formData.get('message');

    // Gunakan client yang sudah diinisialisasi dengan benar
    const { data, error } = await supabaseClient
      .from('messages') // Pastikan nama tabel ini benar
      .insert([{ name, email, message }]);

    if(error){
      contactMsg.textContent = 'Gagal mengirim pesan: ' + error.message;
      contactMsg.style.color = '#e63946'; // Merah untuk error
    } else {
      contactMsg.textContent = 'Pesan berhasil dikirim! Terima kasih.';
      contactMsg.style.color = '#2a9d8f'; // Hijau untuk sukses
      contactForm.reset(); // Kosongkan form setelah berhasil
    }
    
    // Aktifkan kembali tombolnya
    submitButton.disabled = false;
    submitButton.textContent = 'Kirim Pesan';
  });
}
