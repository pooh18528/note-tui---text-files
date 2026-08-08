<div align="center">

# 📝 note-tui

**แอปพลิเคชันจดโน้ตแบบ Terminal UI (TUI) บันทึกเป็นไฟล์ข้อความ (Text Files)**

[English](README.md) | [ภาษาไทย](README.th.md)

![note-tui preview](img/demo.png)

</div>

---

## ✨ จุดเด่น / Features

- 📁 **บันทึกเป็นไฟล์ข้อความธรรมดา**: บันทึกโน้ตทุกตัวเป็นไฟล์ `.md` หรือ `.txt` ในโฟลเดอร์ `./notes` (หรือกำหนดผ่าน `--dir`) เปิดได้กับโปรแกรมใดก็ได้ หรือนำไปซิงค์ผ่าน Git/Cloud ได้ทันที
- 🎨 **Modern Sleek Interface**: ดีไซน์สวยงามด้วย [Ink](https://github.com/vadimdemedes/ink) (React สำหรับ CLI) ธีม Dark Mode พร้อมรองรับภาษาไทย
- 🔍 **Real-time Live Search**: กด `/` เพื่อค้นหาข้อความภายในเนื้อหาโน้ตหรือชื่อไฟล์ได้ทันที
- 📊 **สถิติโน้ต**: แสดงจำนวนคำ (Word Count), จำนวนบรรทัด (Line Count), เวลาแก้ไขล่าสุด และขนาดไฟล์
- ⌨️ **Keyboard Driven**: ทำงานรวดเร็วผ่านแป้นพิมพ์ทั้งหมด
- ✅ **ไม่มี Native dependencies**: ไม่ต้อง node-gyp หรือ Visual Studio build — ใช้ JavaScript ล้วน

---

## 🚀 วิธีใช้งาน

> ต้องใช้ [Node.js](https://nodejs.org/) **เวอร์ชัน 22 ขึ้นไป** ไม่ต้องติดตั้งเครื่องมืออื่นเพิ่มเติม

### 1. รันแบบ Local
```bash
npm install
npm start
```

### 2. Build เป็นไฟล์เดียว & ตรวจสอบความถูกต้อง
```bash
npm run build   # รวมโค้ดไว้ที่ dist/note-tui.mjs
```

### 3. รันเทสต์
```bash
npm test
```

### 4. ติดตั้งเป็นคำสั่งระดับ Global (ไม่บังคับ)
```bash
npm link
note-tui
```

---

## ⌨️ ปุ่มลัด (Keyboard Shortcuts)

| Mode | Key | Action |
|---|---|---|
| **List Mode** | `j` / `Down` | เลื่อนไปโน้ตถัดไป |
| | `k` / `Up` | เลื่อนไปโน้ตก่อนหน้า |
| | `Enter` / `v` | อ่านโน้ตที่เลือก (View note) |
| | `n` | สร้างโน้ตใหม่ (New note) |
| | `e` | แก้ไขโน้ตที่เลือก (Edit note) |
| | `d` | ลบโน้ตที่เลือก (พร้อมยืนยัน) |
| | `/` | ค้นหาโน้ต (Search & Filter) |
| | `r` | โหลดรายการโน้ตใหม่จากดิสก์ (Refresh) |
| | `q` / `Ctrl+C` | ออกจากโปรแกรม (Quit) |
| **Edit Mode** | `Ctrl+S` | บันทึกการแก้ไข (Save note) |
| | `Esc` | ยกเลิกการแก้ไข (Cancel edit) |
| | `Enter` | ขึ้นบรรทัดใหม่ |
| | `↑` / `↓` / `←` / `→` | เลื่อนตำแหน่งเคอร์เซอร์ |
| | `Ctrl+Z` / `Ctrl+Y` | เลิกทำ / ทำซ้ำ (Undo / Redo) |
| **Search Mode** | พิมพ์ข้อความ | กรองรายการโน้ตแบบ Real-time |
| | `Esc` | ล้างคำค้นหา (Clear search) |

---

## 📁 โครงสร้างโปรเจกต์

```
note-tui/
├── src/
│   ├── cli.jsx              # Entry point และ CLI flag parsing (--dir, --version)
│   ├── app.jsx              # App state machine และการสลับโหมดด้วยคีย์บอร์ด
│   ├── storage.js           # ระบบอ่าน/เขียน/ลบ/ค้นหาไฟล์ข้อความ (.md / .txt)
│   ├── styles.js            # จานสี / ธีม
│   ├── utils.js             # ฟังก์ชันตัดข้อความ, จัดรูปแบบวันที่
│   └── ui/
│       ├── Header.jsx       # แถบหัวข้อด้านบน
│       ├── Sidebar.jsx      # รายการโน้ตทางซ้าย
│       ├── NoteView.jsx     # หน้าต่างอ่านโน้ต (เลื่อนได้)
│       ├── CreateForm.jsx   # ฟอร์มสร้างโน้ตใหม่
│       ├── EditorPane.jsx   # โปรแกรมแก้ไขหลายบรรทัด (เลขบรรทัด, undo)
│       ├── SearchBox.jsx    # ช่องค้นหาแบบ Live
│       ├── DeleteView.jsx   # ยืนยันการลบโน้ต
│       └── StatusBar.jsx    # แถบคำแนะนำ & ข้อความแจ้งเตือน
├── scripts/
│   └── run.mjs              # ตัวรันแบบ dev (แปลง JSX ผ่าน esbuild)
├── tests/
│   ├── storage.test.js      # Unit test ระบบจัดเก็บไฟล์
│   └── app.test.jsx         # UI smoke tests
├── img/
│   └── demo.png             # รูปพรีวิวตัวอย่างแอปพลิเคชัน
└── notes/                   # โฟลเดอร์เก็บไฟล์โน้ตจริง
    ├── welcome.md
    └── shortcut-guide.md
```

---

## 📄 License
MIT License