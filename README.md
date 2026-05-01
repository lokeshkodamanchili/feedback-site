# 🚀 Pulse — PDF Feedback Portal

A modern, real-time feedback platform built to collect user opinions on study PDFs.  
Users can rate content, share feedback, and view live analytics instantly.

---

## 🌐 Live Website

👉 https://lokeshkodamanchili.github.io/feedback-site/

---

## 🧠 Project Overview

This project was created to understand whether shared PDFs are actually useful for students.

Users can:
- Give ratings ⭐  
- Share honest feedback 💬  
- View real-time insights 📊  

The goal is to improve content quality based on real user responses.

---

## ✨ Features

- ⭐ 5-star interactive rating system  
- 💬 Feedback submission form  
- 📊 Real-time analytics dashboard:
  - Average rating  
  - Total reviews  
  - Most given rating  
- 📈 Chart visualization using Chart.js  
- ⚡ Live data storage with Supabase  
- 🎨 Premium UI (glassmorphism + gradient design)  
- 📱 Fully responsive layout  

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Charts:** Chart.js  
- **Database:** Supabase  
- **Hosting:** GitHub Pages  

---

## 📁 Project Structure

```

pdf-feedback-site/
│
├── index.html
├── style.css
├── script.js
├── logo.jpeg
└── README.md

````

---

## ⚙️ How to Run Locally

```bash
git clone https://github.com/lokeshkodamanchili/feedback-site.git
cd feedback-site
````

Then open:

```
index.html
```

---

## 🔧 Database Setup (Supabase)

Create a table named:

```
feedbacks
```

### Columns:

| Column | Type               |
| ------ | ------------------ |
| id     | int8 (primary key) |
| name   | text               |
| rating | int2               |
| text   | text               |

---

## 🔐 Security

* Uses Supabase **Row Level Security (RLS)**
* Only public (anon) key is used
* No sensitive or secret keys exposed

---

## 🎯 Purpose

This project helps in:

* Evaluating usefulness of shared PDFs
* Collecting honest student feedback
* Improving future content based on analytics

---

## 🚀 Future Improvements

* 🔐 User authentication
* 🧑‍💼 Admin dashboard
* 📊 Advanced analytics
* 🌙 Dark/Light mode
* 📥 Feedback export system

---

## 👨‍💻 Author

**Lokesh Kodamanchili**
🔗 [https://github.com/lokeshkodamanchili](https://github.com/lokeshkodamanchili)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

