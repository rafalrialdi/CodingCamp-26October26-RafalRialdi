# Requirements Document

## Introduction

**Fitur Utama:**

Expense & Budget Visualizer adalah aplikasi web mobile-friendly yang dirancang untuk membantu pengguna melacak pengeluaran harian mereka dengan antarmuka yang sederhana dan intuitif.

**Deskripsi Lengkap:**

Aplikasi ini memungkinkan pengguna menambahkan transaksi, melihat daftar pengeluaran, dan memvisualisasikan distribusi pengeluaran berdasarkan kategori melalui chart interaktif. Semua data disimpan secara lokal di browser pengguna tanpa memerlukan backend server.

## Glossary

- **Pengguna**: Individu yang menggunakan aplikasi untuk melacak pengeluaran pribadi
- **Transaksi**: Catatan pengeluaran yang terdiri dari nama item, jumlah, dan kategori
- **Kategori**: Klasifikasi pengeluaran (Makanan, Transportasi, Hiburan)
- **Total Balance**: Jumlah kumulatif dari semua pengeluaran yang telah dicatat
- **Local Storage**: Mekanisme penyimpanan data di sisi klien menggunakan browser API
- **Pie Chart**: Visualisasi grafik yang menampilkan proporsi pengeluaran per kategori
- **Validasi**: Proses pemeriksaan bahwa semua input field telah diisi dengan data yang valid
- **Item**: Satuan individual dari pengeluaran dalam transaksi

## Requirements

### Requirement 1: Input Form untuk Penambahan Transaksi

**User Story:** Sebagai pengguna, saya ingin menambahkan pengeluaran baru dengan mengisi form yang sederhana, sehingga dapat mencatat setiap pengeluaran yang saya lakukan.

#### Acceptance Criteria

1. THE Input_Form SHALL memiliki tiga field yang harus diisi: Item Name, Amount, dan Category
2. WHEN Pengguna mengklik Category dropdown, THE Input_Form SHALL menampilkan tiga pilihan kategori: Makanan, Transportasi, dan Hiburan
3. WHEN Pengguna mengklik tombol Add Transaction, THE Input_Form SHALL memvalidasi bahwa ketiga field (Item Name, Amount, Category) telah diisi
4. IF salah satu field kosong atau Amount bukan angka positif, THEN THE Input_Form SHALL menampilkan pesan error dan tidak menambahkan transaksi
5. WHEN validasi berhasil, THE Input_Form SHALL menambahkan transaksi ke daftar dan mereset semua field ke keadaan kosong
6. THE Input_Form SHALL menerima input Amount dengan format numerik dan menolak nilai negatif atau nol

### Requirement 2: Daftar Transaksi yang Dapat Digulung

**User Story:** Sebagai pengguna, saya ingin melihat daftar lengkap semua pengeluaran yang telah saya catat dengan detail setiap transaksi, sehingga dapat melacak riwayat pengeluaran saya.

#### Acceptance Criteria

1. THE Transaction_List SHALL menampilkan setiap transaksi dalam format yang jelas dengan menampilkan Item Name, Amount, dan Category
2. WHEN jumlah transaksi melebihi kapasitas layar, THE Transaction_List SHALL dapat di-scroll untuk melihat semua item
3. WHEN Pengguna menambahkan transaksi baru, THE Transaction_List SHALL segera memperbarui dan menampilkan transaksi terbaru
4. THE Transaction_List SHALL menampilkan setiap item dengan visual yang konsisten dan mudah dibaca
5. WHEN Pengguna menghapus transaksi, THE Transaction_List SHALL segera menghapus item tersebut dari tampilan

### Requirement 3: Tombol Hapus untuk Setiap Transaksi

**User Story:** Sebagai pengguna, saya ingin dapat menghapus transaksi yang salah atau tidak diperlukan, sehingga dapat memperbaiki kesalahan pencatatan.

#### Acceptance Criteria

1. THE Transaction_List SHALL menampilkan tombol Hapus untuk setiap transaksi
2. WHEN Pengguna mengklik tombol Hapus, THE Transaction_List SHALL menghapus transaksi dari daftar
3. WHEN transaksi dihapus, THE Total_Balance SHALL diperbarui secara otomatis dengan jumlah yang baru
4. WHEN transaksi dihapus, THE Pie_Chart SHALL diperbarui untuk mencerminkan perubahan distribusi pengeluaran

### Requirement 4: Tampilan Total Balance di Bagian Atas

**User Story:** Sebagai pengguna, saya ingin melihat total pengeluaran saya secara menonjol di bagian atas aplikasi, sehingga dapat langsung mengetahui berapa total uang yang telah saya habiskan.

#### Acceptance Criteria

1. THE Total_Balance_Display SHALL menampilkan jumlah kumulatif dari semua pengeluaran di bagian atas aplikasi dengan format mata uang yang jelas
2. WHEN Pengguna menambahkan transaksi baru, THE Total_Balance_Display SHALL diperbarui secara instan untuk menampilkan total yang baru
3. WHEN Pengguna menghapus transaksi, THE Total_Balance_Display SHALL diperbarui untuk mengurangi total dengan jumlah transaksi yang dihapus
4. WHEN aplikasi dimulai dan tidak ada transaksi, THE Total_Balance_Display SHALL menampilkan nilai 0

### Requirement 5: Pie Chart untuk Visualisasi Distribusi Pengeluaran

**User Story:** Sebagai pengguna, saya ingin melihat visualisasi grafik yang menunjukkan bagaimana pengeluaran saya terdistribusi di setiap kategori, sehingga dapat memahami pola pengeluaran dengan lebih baik.

#### Acceptance Criteria

1. THE Pie_Chart SHALL menampilkan distribusi pengeluaran berdasarkan kategori (Makanan, Transportasi, Hiburan)
2. WHEN Pengguna menambahkan atau menghapus transaksi, THE Pie_Chart SHALL diperbarui secara otomatis untuk mencerminkan perubahan proporsi
3. THE Pie_Chart SHALL menggunakan warna yang berbeda untuk setiap kategori agar mudah dibedakan
4. THE Pie_Chart SHALL menampilkan label kategori dan persentase untuk setiap segmen
5. WHEN tidak ada pengeluaran dalam kategori tertentu, THE Pie_Chart SHALL tidak menampilkan segmen untuk kategori tersebut atau menampilkan dengan nilai 0%

### Requirement 6: Penyimpanan Data Menggunakan Local Storage

**User Story:** Sebagai pengguna, saya ingin data pengeluaran saya disimpan secara otomatis, sehingga ketika saya menutup browser dan membukanya kembali, data saya tetap tersimpan.

#### Acceptance Criteria

1. THE Expense_Tracker SHALL menyimpan semua transaksi ke Local Storage browser secara otomatis setiap kali transaksi ditambahkan atau dihapus
2. WHEN aplikasi dimulai, THE Expense_Tracker SHALL memuat semua transaksi yang tersimpan dari Local Storage
3. WHEN Pengguna menutup browser dan membuka aplikasi kembali, THE Expense_Tracker SHALL menampilkan semua transaksi yang sebelumnya dicatat
4. WHEN Local Storage kosong (instalasi pertama), THE Expense_Tracker SHALL menampilkan aplikasi dalam keadaan kosong tanpa error

### Requirement 7: Responsif di Perangkat Mobile dan Desktop

**User Story:** Sebagai pengguna, saya ingin menggunakan aplikasi ini di berbagai perangkat (smartphone, tablet, desktop), sehingga dapat melacak pengeluaran kapan saja dan di mana saja.

#### Acceptance Criteria

1. THE User_Interface SHALL menyesuaikan layout secara responsif untuk berbagai ukuran layar (mobile, tablet, desktop)
2. WHEN aplikasi diakses di perangkat mobile, THE User_Interface SHALL menampilkan elemen-elemen dengan ukuran yang sesuai dan mudah diklik
3. WHEN aplikasi diakses di perangkat desktop, THE User_Interface SHALL menampilkan layout yang optimal dengan memanfaatkan ruang layar yang lebih besar
4. THE Form_Elements SHALL tetap mudah diakses dan digunakan di semua ukuran layar

### Requirement 8: Kompatibilitas Browser Modern

**User Story:** Sebagai pengguna, saya ingin aplikasi ini berfungsi dengan baik di berbagai browser yang saya gunakan, sehingga dapat mengakses aplikasi tanpa hambatan.

#### Acceptance Criteria

1. THE Expense_Tracker SHALL berfungsi dengan baik di browser modern: Chrome, Firefox, Edge, dan Safari (versi terbaru)
2. WHEN diakses melalui browser yang didukung, THE Expense_Tracker SHALL menampilkan semua fitur dan fungsi tanpa error
3. THE Expense_Tracker SHALL menggunakan fitur JavaScript dan CSS yang kompatibel dengan browser modern

### Requirement 9: Stack Teknologi (Vanilla JavaScript)

**User Story:** Sebagai developer, saya ingin codebase menggunakan Vanilla JavaScript tanpa dependency framework, sehingga aplikasi tetap ringan dan mudah dimaintain.

#### Acceptance Criteria

1. THE Codebase SHALL menggunakan HTML untuk struktur, CSS untuk styling, dan Vanilla JavaScript untuk logika
2. THE Codebase SHALL TIDAK menggunakan framework seperti React, Vue, Angular, atau library serupa
3. THE Codebase SHALL mengorganisir file dalam struktur: css/ untuk stylesheet, js/ untuk script, dan HTML sebagai entry point
4. THE Codebase SHALL berisi satu file CSS dan satu file JavaScript utama untuk menjaga kesederhanaan

### Requirement 10: Interface yang Bersih dan Minimal

**User Story:** Sebagai pengguna, saya ingin menggunakan aplikasi dengan interface yang sederhana dan tidak membingungkan, sehingga dapat langsung memahami cara menggunakannya tanpa tutorial panjang.

#### Acceptance Criteria

1. THE User_Interface SHALL menampilkan hanya elemen-elemen yang diperlukan untuk fungsi utama tanpa fitur tambahan yang membingungkan
2. THE User_Interface SHALL menggunakan hierarki visual yang jelas untuk membedakan elemen-elemen penting
3. THE Typography SHALL menggunakan font yang mudah dibaca dengan ukuran yang sesuai untuk kenyamanan mata
4. THE Color_Scheme SHALL konsisten dan tidak berlebihan, menggunakan warna-warna yang netral atau sesuai dengan kategori

### Requirement 11: Kinerja Aplikasi

**User Story:** Sebagai pengguna, saya ingin aplikasi merespons dengan cepat setiap kali saya melakukan aksi, sehingga pengalaman pengguna terasa lancar tanpa lag.

#### Acceptance Criteria

1. WHEN Pengguna menambahkan transaksi, THE Expense_Tracker SHALL merespons dan memperbarui tampilan dalam waktu kurang dari 100ms
2. WHEN Pengguna menghapus transaksi, THE Pie_Chart SHALL diperbarui tanpa lag atau delay yang terasa
3. THE Pie_Chart_Rendering SHALL menggunakan teknik yang efisien untuk meminimalkan repainting browser
4. WHEN aplikasi dimulai, THE Expense_Tracker SHALL load dalam waktu kurang dari 1 detik

### Requirement 12: Tanpa Setup atau Konfigurasi Kompleks

**User Story:** Sebagai pengguna, saya ingin membuka aplikasi langsung tanpa perlu instalasi atau konfigurasi yang rumit, sehingga dapat langsung mulai mencatat pengeluaran.

#### Acceptance Criteria

1. THE Expense_Tracker SHALL dapat diakses langsung melalui browser tanpa memerlukan backend server
2. THE Expense_Tracker SHALL tidak memerlukan langkah instalasi atau build process
3. WHEN file HTML dibuka di browser, THE Expense_Tracker SHALL berfungsi sepenuhnya

## Technical Constraints

### TC-1: Technology Stack

THE Expense_Tracker SHALL menggunakan:
- HTML untuk struktur dokumen
- CSS untuk styling dan layout
- Vanilla JavaScript untuk logika aplikasi
- TIDAK menggunakan framework frontend seperti React, Vue, Angular, atau library equivalent

### TC-2: Data Storage

THE Expense_Tracker SHALL menyimpan semua data menggunakan browser Local Storage API dengan format JSON untuk memastikan:
- Semua data disimpan di sisi klien (client-side only)
- Tidak ada komunikasi ke backend server
- Data persisten hingga pengguna menghapus browser cache

### TC-3: Browser Compatibility

THE Expense_Tracker SHALL kompatibel dengan browser modern:
- Google Chrome (versi terbaru)
- Mozilla Firefox (versi terbaru)
- Microsoft Edge (versi terbaru)
- Apple Safari (versi terbaru)

## Non-Functional Requirements

### NFR-1: Simplicity

THE User_Interface SHALL dirancang dengan prinsip kesederhanaan:
- Interface bersih dengan visual hierarchy yang jelas
- Hanya menampilkan elemen esensial tanpa fitur kompleks
- Intuitif dan mudah dipahami pengguna tanpa training
- No complex setup atau configuration required

### NFR-2: Performance

THE Expense_Tracker SHALL memenuhi kriteria performa:
- Load time kurang dari 1 detik
- Respons user interaction kurang dari 100ms
- Smooth animation dan chart rendering
- Efficient DOM manipulation dan re-rendering

### NFR-3: Visual Design

THE User_Interface SHALL memenuhi standar desain visual:
- User-friendly aesthetic dengan warna dan typography yang konsisten
- Clear visual hierarchy untuk membedakan informasi penting
- Readable typography dengan contrast yang baik
- Responsive design yang menyesuaikan dengan berbagai ukuran layar

## Optional Features (Pengguna dapat memilih 3 dari 5)

### Optional Feature 1: Custom Categories

**Description:** Pengguna dapat menambahkan kategori pengeluaran yang dipilih sendiri, tidak terbatas pada tiga kategori default.

**Acceptance Criteria:**
- WHEN Pengguna mengklik opsi "Add Category" dalam form, THE Input_Form SHALL menampilkan field untuk memasukkan nama kategori baru
- WHEN Pengguna menambahkan kategori baru, THE Category_List SHALL diperbarui untuk menampilkan kategori tersebut
- THE Pie_Chart SHALL menampilkan segmen untuk kategori custom yang telah ditambahkan

### Optional Feature 2: Monthly Summary View

**Description:** Pengguna dapat melihat ringkasan pengeluaran bulanan dengan breakdown per kategori.

**Acceptance Criteria:**
- THE Application SHALL menampilkan tab atau section untuk Monthly Summary
- WHEN Pengguna membuka Monthly Summary, THE Application SHALL menampilkan total pengeluaran per bulan
- WHEN Pengguna memilih bulan tertentu, THE Application SHALL menampilkan breakdown pengeluaran per kategori untuk bulan tersebut

### Optional Feature 3: Sort Transactions

**Description:** Pengguna dapat mengurutkan transaksi berdasarkan jumlah atau kategori.

**Acceptance Criteria:**
- THE Transaction_List SHALL menampilkan opsi sort dengan pilihan: By Amount (Ascending/Descending) dan By Category
- WHEN Pengguna memilih opsi sort, THE Transaction_List SHALL diurutkan sesuai pilihan tanpa mengubah data asli
- THE Sorting SHALL tidak mempengaruhi Total_Balance_Display

### Optional Feature 4: Export Data

**Description:** Pengguna dapat mengekspor data pengeluaran ke format CSV atau JSON.

**Acceptance Criteria:**
- THE Application SHALL menyediakan tombol Export di interface
- WHEN Pengguna mengklik Export, THE Application SHALL mendownload file dengan format yang dipilih
- THE Exported_Data SHALL berisi semua transaksi dengan kolom: Item Name, Amount, Category, Date

### Optional Feature 5: Budget Limit Alert

**Description:** Pengguna dapat menetapkan budget limit per kategori dan mendapatkan peringatan ketika budget terlampaui.

**Acceptance Criteria:**
- THE Application SHALL menyediakan interface untuk menetapkan budget limit per kategori
- WHEN total pengeluaran kategori melebihi limit, THE Application SHALL menampilkan peringatan visual
- THE Alert SHALL menampilkan informasi: kategori, budget limit, dan pengeluaran saat ini
