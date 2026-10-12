"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, LockKeyhole, Download, Users, MessageCircle, Mail,
  BookOpen, Search, ChevronDown, ChevronUp, ExternalLink, RefreshCw,
  ClipboardList, ShieldCheck, Clock3, TrendingUp, CheckCircle2
} from "lucide-react";
import { MOCK_SUBJECTS, RELEASED_MOCKS } from "@/lib/csca/mocktest-public";
import { PHONE_COUNTRIES } from "@/lib/csca/phone-countries";

type ExamAttempt = {
  id: string;
  subject: string;
  test_number: number;
  score: number;
  total_marks: number;
  percentage: number;
  question_count: number;
  duration_minutes: number;
  away_count: number;
  token: string;
  started_at: string;
  submitted_at: string;
};
type Student = {
  phone: string;
  country_iso2?: string | null;
  name: string;
  email: string;
  exam_count: number;
  average_score: number;
  last_submitted_at: string;
  email_sent_at?: string | null;
  attempts: ExamAttempt[];
};
type Submission = {
  id: string; candidate_name: string; candidate_email: string; phone: string;
  score: number; total_marks: number; question_count: number; duration_minutes: number;
  away_count: number; token: string; submitted_at: string; subject: string; test_number: number;
};
const csvCell = (v: unknown) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
const digits = (v: string) => String(v || "").replace(/[^0-9]/g, "");
const displayPhone = (v: string) => {
  const d = digits(v);
  if (d.startsWith("880") && d.length === 13) return "0" + d.slice(3);
  if (d.startsWith("86") && d.length === 13) return "+86 " + d.slice(2);
  return d.length >= 8 ? "+" + d : d;
};
const waPhone = (v: string, countryIso?: string) => {
  const d = digits(v);
  // New records have already been stored in international format with the selected country recorded.
  if (countryIso && PHONE_COUNTRIES.some(country => country.iso2 === countryIso)) return d;
  if (d.startsWith("880") && d.length === 13) return d;
  if (d.startsWith("86") && d.length === 13) return d;
  // Legacy Bangladesh local formats.
  if (/^01[3-9]\d{8}$/.test(d)) return "88" + d;
  if (/^1[3-9]\d{8}$/.test(d)) return "880" + d;
  // Old China local format.
  if (/^1[3-9]\d{9}$/.test(d)) return "86" + d;
  return d;
};
const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(String(v || "").trim());
const titleCase = (v: string) => v ? v.charAt(0).toUpperCase() + v.slice(1) : "Subject";
const studentCountryIso = (student: Student) => {
  const saved = String(student.country_iso2 || "").toLowerCase();
  if (PHONE_COUNTRIES.some(country => country.iso2 === saved)) return saved;
  const d = digits(student.phone);
  const matches = PHONE_COUNTRIES.filter(country => d.startsWith(country.dialCode));
  if (!matches.length) return "";
  const longest = Math.max(...matches.map(country => country.dialCode.length));
  const best = matches.filter(country => country.dialCode.length === longest);
  return best.length === 1 ? best[0].iso2 : "";
};
const studentCountryLabel = (student: Student) =>
  PHONE_COUNTRIES.find(country => country.iso2 === studentCountryIso(student))?.name || "Not recorded";

const dateLabel = (v: string) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
};

export default function MockTestAdmin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [logged, setLogged] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [mode, setMode] = useState<"students" | "reports">("students");

  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [studentSort, setStudentSort] = useState<"recent" | "attempts" | "high" | "low">("recent");
  const [expandedPhone, setExpandedPhone] = useState("");
  const [sendingPhone, setSendingPhone] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionNotice, setActionNotice] = useState("");

  const [subject, setSubject] = useState<"mathematics" | "physics" | "chemistry">("mathematics");
  const [test, setTest] = useState(1);
  const [rows, setRows] = useState<Submission[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minScore === "" ? 0 : Math.max(0, Math.min(100, Number(minScore)));
    const max = maxScore === "" ? 100 : Math.max(0, Math.min(100, Number(maxScore)));
    const filtered = students.filter(s => {
      const iso = studentCountryIso(s);
      if (countryFilter === "unknown" && iso) return false;
      if (countryFilter !== "all" && countryFilter !== "unknown" && iso !== countryFilter) return false;
      if (subjectFilter !== "all" && !s.attempts.some(at => at.subject === subjectFilter)) return false;
      if (minScore !== "" && s.average_score < min) return false;
      if (maxScore !== "" && s.average_score > max) return false;
      if (q && ![
        s.name, s.phone, displayPhone(s.phone), s.email, studentCountryLabel(s)
      ].some(value => String(value || "").toLowerCase().includes(q))) return false;
      return true;
    });
    filtered.sort((a, b) => {
      if (studentSort === "attempts") return b.exam_count - a.exam_count || b.average_score - a.average_score;
      if (studentSort === "high") return b.average_score - a.average_score || b.exam_count - a.exam_count;
      if (studentSort === "low") return a.average_score - b.average_score || b.exam_count - a.exam_count;
      return new Date(b.last_submitted_at).getTime() - new Date(a.last_submitted_at).getTime();
    });
    return filtered;
  }, [students, search, countryFilter, subjectFilter, minScore, maxScore, studentSort]);

  async function loadStudents(t = token) {
    setStudentError("");
    setStudentsLoading(true);
    try {
      const r = await fetch("/api/csca/mocktest?students=1", {
        headers: { "x-csca-admin-token": t }, cache: "no-store"
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not load student directory.");
      setStudents(Array.isArray(d.students) ? d.students : []);
    } catch (e) {
      setStudentError(e instanceof Error ? e.message : "Could not load student directory.");
    } finally {
      setStudentsLoading(false);
    }
  }

  async function loadReports(s = subject, n = test, t = token) {
    setReportError("");
    setReportsLoading(true);
    try {
      const r = await fetch("/api/csca/mocktest?admin=1&subject=" + s + "&test=" + n, {
        headers: { "x-csca-admin-token": t }, cache: "no-store"
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not load exam reports.");
      setRows(Array.isArray(d.submissions) ? d.submissions : []);
    } catch (e) {
      setReportError(e instanceof Error ? e.message : "Could not load exam reports.");
    } finally {
      setReportsLoading(false);
    }
  }

  async function login() {
    setLoginError("");
    setStudentsLoading(true);
    try {
      const r = await fetch("/api/csca/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminLogin: true, phone, password })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Login failed.");
      setToken(d.token);
      setLogged(true);
      await loadStudents(d.token);
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : "Unable to connect.");
    } finally {
      setStudentsLoading(false);
    }
  }

  function selectReportSubject(s: "mathematics" | "physics" | "chemistry") {
    setSubject(s);
    void loadReports(s, test, token);
  }
  function selectReportTest(n: number) {
    setTest(n);
    void loadReports(subject, n, token);
  }

  function whatsappUrl(student: Student) {
    const latest = student.attempts[0];
    const examTitle = latest ? titleCase(latest.subject) + " Mock Test " + latest.test_number : "CSCA Mock Test";
    const score = latest ? Number(latest.score).toFixed(2).replace(/\.00$/, "") + "/" + latest.total_marks +
      " (" + latest.percentage + "%)" : "";
    const resultUrl = latest ? "https://globlearnedu.com/csca/mocktest/result/" + latest.token : "";
    const message =
      "Hello " + student.name + ",\n\n" +
      "Thank you for taking a CSCA mock test arranged by GL Education" +
      (latest ? " — " + examTitle + (score ? " (your recorded score: " + score + ")" : "") : "") +
      ". We hope it was useful for your preparation." +
      (resultUrl ? "\n\nYour result: " + resultUrl : "") +
      "\n\nYou are very welcome to contact us if you need guidance with CSCA preparation, admission to universities in China, or your wider study-abroad journey. We will be glad to help with relevant information and next steps." +
      "\n\nWarm regards,\nGL Education · Study in China";
    return "https://wa.me/" + waPhone(student.phone, studentCountryIso(student)) + "?text=" + encodeURIComponent(message);
  }

  async function sendThankYouEmail(student: Student) {
    setActionError("");
    setActionNotice("");
    if (!validEmail(student.email)) {
      setActionError("This student does not have a valid email address saved, so the email cannot be sent.");
      return;
    }
    if (student.email_sent_at && Date.now() - new Date(student.email_sent_at).getTime() < 24 * 60 * 60 * 1000) {
      setActionError("A thank-you email was already sent to this student in the last 24 hours.");
      return;
    }
    const confirmed = window.confirm(
      "Send a personalized thank-you email to " + student.name + " at " + student.email +
      "? The system limits successful thank-you emails to one per student every 24 hours."
    );
    if (!confirmed) return;
    setSendingPhone(student.phone);
    try {
      const r = await fetch("/api/csca/mocktest", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csca-admin-token": token },
        body: JSON.stringify({ action: "sendThankYouEmail", phone: student.phone })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Email was not sent.");
      setActionNotice("Thank-you email sent to " + student.name + ".");
      await loadStudents(token);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Unable to send the email.");
      await loadStudents(token);
    } finally {
      setSendingPhone("");
    }
  }

  function downloadStudents() {
    const head = ["Full name", "Phone number", "Country", "Email", "Exams taken", "Average score (%)", "Latest exam date"];
    const body = filteredStudents.map(s => [
      s.name, displayPhone(s.phone), studentCountryLabel(s), s.email, s.exam_count, s.average_score, dateLabel(s.last_submitted_at)
    ]);
    const blob = new Blob(["\ufeff" + [head, ...body].map(row => row.map(csvCell).join(",")).join("\n")], {
      type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GL-CSCA-Student-Directory.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadReports() {
    const head = ["Candidate", "Phone", "Email", "Subject", "Test", "Score", "Max marks", "Questions", "Duration minutes", "Screen departures", "Submitted", "Result URL"];
    const body = rows.map(r => [
      r.candidate_name, displayPhone(r.phone), r.candidate_email, titleCase(r.subject), r.test_number,
      r.score, r.total_marks, r.question_count, r.duration_minutes, r.away_count, dateLabel(r.submitted_at),
      "https://globlearnedu.com/csca/mocktest/result/" + r.token
    ]);
    const blob = new Blob(["\ufeff" + [head, ...body].map(row => row.map(csvCell).join(",")).join("\n")], {
      type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GL-CSCA-" + subject + "-Mock-" + test + "-Reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!logged) return (
    <main className="min-h-screen bg-slate-50 text-[#0A1628]">
      <section className="bg-gradient-to-br from-[#071A35] via-[#103B5C] to-[#1B3A6B] text-white">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <Link href="/csca/mocktest" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300">
            <ArrowLeft className="h-4 w-4" /> Free Mock Tests
          </Link>
          <p className="mt-8 text-xs font-black uppercase tracking-widest text-[#FFD700]">GL Education · Study in China</p>
          <h1 className="mt-3 text-4xl font-black">Mock Test Administration</h1>
          <p className="mt-3 text-slate-300">Student directory, exam history and one-to-one follow-up tools.</p>
        </div>
      </section>
      <section className="mx-auto max-w-md px-5 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <LockKeyhole className="h-8 w-8 text-[#C8102E]" />
          <h2 className="mt-4 text-2xl font-black">Admin Login</h2>
          <label className="mt-5 block text-sm font-bold">Admin phone
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Admin phone number" inputMode="tel" className="mt-2 w-full rounded-xl border px-4 py-3" />
          </label>
          <label className="mt-4 block text-sm font-bold">Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void login(); }} placeholder="Password" className="mt-2 w-full rounded-xl border px-4 py-3" />
          </label>
          {loginError && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{loginError}</p>}
          <button onClick={() => void login()} disabled={studentsLoading} className="mt-5 w-full rounded-xl bg-[#C8102E] px-5 py-3.5 font-black text-white disabled:opacity-50">
            {studentsLoading ? "Signing in…" : "Login to Reports"}
          </button>
        </div>
      </section>
    </main>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-[#0A1628]">
      <header className="bg-gradient-to-br from-[#071A35] via-[#103B5C] to-[#1B3A6B] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/csca/mocktest" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300">
              <ArrowLeft className="h-4 w-4" /> Free Mock Tests
            </Link>
            <span className="font-black"><span className="text-[#C8102E]">GL</span> Education · <span className="text-[#FFD700]">Study in China</span></span>
          </div>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Private administration workspace</p>
              <h1 className="mt-2 text-3xl font-black md:text-5xl">Mock Test Administration</h1>
              <p className="mt-3 text-sm text-slate-300">Personalized follow-up, student records and exam performance.</p>
            </div>
            <button onClick={() => mode === "students" ? void loadStudents(token) : void loadReports(subject, test, token)} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-black hover:bg-white/10">
              <RefreshCw className="h-4 w-4" /> Refresh data
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-7">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><Users className="h-5 w-5 text-[#1B3A6B]" /><span className="text-xs font-bold text-slate-400">Unique phones</span></div>
            <p className="mt-3 text-3xl font-black">{students.length}</p>
            <p className="mt-1 text-xs text-slate-500">Student contacts in the mock-test directory</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><ClipboardList className="h-5 w-5 text-[#C8102E]" /><span className="text-xs font-bold text-slate-400">Saved attempts</span></div>
            <p className="mt-3 text-3xl font-black">{students.reduce((sum, s) => sum + s.exam_count, 0)}</p>
            <p className="mt-1 text-xs text-slate-500">Repeated attempts are kept in history</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><TrendingUp className="h-5 w-5 text-emerald-600" /><span className="text-xs font-bold text-slate-400">Average result</span></div>
            <p className="mt-3 text-3xl font-black">{students.length ? (students.reduce((sum, s) => sum + s.average_score, 0) / students.length).toFixed(1) + "%" : "—"}</p>
            <p className="mt-1 text-xs text-slate-500">Mean of students’ average percentages</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><ShieldCheck className="h-5 w-5 text-[#1B3A6B]" /><span className="text-xs font-bold text-slate-400">Follow-up guard</span></div>
            <p className="mt-3 text-3xl font-black">24 hours</p>
            <p className="mt-1 text-xs text-slate-500">Email thank-you cooldown per student</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          <button onClick={() => setMode("students")} className={"inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black " + (mode === "students" ? "bg-[#1B3A6B] text-white" : "border border-slate-200 bg-white text-slate-600")}>
            <Users className="h-4 w-4" /> Student Directory
          </button>
          <button onClick={() => { setMode("reports"); void loadReports(subject, test, token); }} className={"inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black " + (mode === "reports" ? "bg-[#1B3A6B] text-white" : "border border-slate-200 bg-white text-slate-600")}>
            <ClipboardList className="h-4 w-4" /> Exam Reports
          </button>
        </div>

        {mode === "students" && (
          <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Student Directory</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">One row per unique saved phone number. Exam count and average score include each recorded attempt, including retakes.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="relative block min-w-[220px] flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone or email" className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-[#1B3A6B]" />
                  </label>
                  <button onClick={downloadStudents} disabled={!filteredStudents.length} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-[#1B3A6B] disabled:opacity-40"><Download className="h-4 w-4" /> Export CSV</button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <label className="block text-xs font-bold text-slate-500">Country
                  <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#1B3A6B]">
                    <option value="all">All countries</option>
                    <option value="unknown">Not recorded / ambiguous</option>
                    {PHONE_COUNTRIES.map(country => <option key={country.iso2} value={country.iso2}>{country.name} (+{country.dialCode})</option>)}
                  </select>
                </label>
                <label className="block text-xs font-bold text-slate-500">Subject attempted
                  <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#1B3A6B]">
                    <option value="all">Any subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                  </select>
                </label>
                <label className="block text-xs font-bold text-slate-500">Average score min (%)
                  <input type="number" min="0" max="100" value={minScore} onChange={e => setMinScore(e.target.value)} placeholder="0" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#1B3A6B]" />
                </label>
                <label className="block text-xs font-bold text-slate-500">Average score max (%)
                  <input type="number" min="0" max="100" value={maxScore} onChange={e => setMaxScore(e.target.value)} placeholder="100" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#1B3A6B]" />
                </label>
                <label className="block text-xs font-bold text-slate-500">Sort students
                  <select value={studentSort} onChange={e => setStudentSort(e.target.value as "recent" | "attempts" | "high" | "low")} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#1B3A6B]">
                    <option value="recent">Latest activity</option>
                    <option value="attempts">Most mock tests taken</option>
                    <option value="high">Highest average score</option>
                    <option value="low">Lowest average score</option>
                  </select>
                </label>
                <div className="flex items-end">
                  <button onClick={() => { setSearch(""); setCountryFilter("all"); setSubjectFilter("all"); setMinScore(""); setMaxScore(""); setStudentSort("recent"); }} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Reset filters</button>
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">Showing {filteredStudents.length} of {students.length} unique students.</p>
              {studentError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{studentError}</p>}
              {actionError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{actionError}</p>}
              {actionNotice && <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {actionNotice}</p>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Phone number</th>
                    <th className="px-5 py-4">Country</th>
                    <th className="px-5 py-4">Exams taken</th>
                    <th className="px-5 py-4">Average score</th>
                    <th className="px-5 py-4">Latest activity</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => {
                    const cooling = Boolean(student.email_sent_at && Date.now() - new Date(student.email_sent_at).getTime() < 24 * 60 * 60 * 1000);
                    const canEmail = validEmail(student.email) && !cooling && sendingPhone !== student.phone;
                    const expanded = expandedPhone === student.phone;
                    return (
                      <Fragment key={student.phone}>
                        <tr key={student.phone} className="align-top hover:bg-slate-50/70">
                          <td className="px-5 py-5">
                            <p className="font-black text-[#0A1628]">{student.name || "Name not recorded"}</p>
                            <p className="mt-1 max-w-[220px] break-all text-xs leading-5 text-slate-500">{student.email || "Email not recorded"}</p>
                          </td>
                          <td className="px-5 py-5 font-bold tabular-nums">{displayPhone(student.phone)}</td>
                          <td className="px-5 py-5 text-sm text-slate-600">{studentCountryLabel(student)}</td>
                          <td className="px-5 py-5"><span className="rounded-full bg-blue-50 px-3 py-1.5 font-black text-[#1B3A6B]">{student.exam_count}</span><span className="ml-2 text-xs text-slate-500">attempts</span></td>
                          <td className="px-5 py-5"><p className="text-lg font-black text-[#1B3A6B]">{student.average_score.toFixed(1)}%</p><p className="mt-1 text-[11px] text-slate-400">Average percentage</p></td>
                          <td className="px-5 py-5 text-xs leading-5 text-slate-500">{dateLabel(student.last_submitted_at)}</td>
                          <td className="px-5 py-5">
                            <div className="flex min-w-[265px] flex-col gap-2">
                              <button onClick={() => setExpandedPhone(expanded ? "" : student.phone)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-black text-[#1B3A6B] hover:bg-blue-50">
                                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                {expanded ? "Hide exam history" : "View exam history"}
                              </button>
                              <button onClick={() => void sendThankYouEmail(student)} disabled={!canEmail} title={cooling ? "A thank-you email was already sent in the last 24 hours" : !validEmail(student.email) ? "A valid email address is required" : "Send one personalized email to this student"} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B3A6B] px-3 py-2.5 text-xs font-black text-white hover:bg-[#102B52] disabled:cursor-not-allowed disabled:opacity-50">
                                <Mail className="h-3.5 w-3.5" /> {sendingPhone === student.phone ? "Sending email…" : cooling ? "Email sent recently" : "Send thank-you email"}
                              </button>
                              <a href={whatsappUrl(student)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-xs font-black text-white hover:bg-[#1fb85a]">
                                <MessageCircle className="h-3.5 w-3.5" /> Prepare WhatsApp message <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        {expanded && (
                          <tr key={student.phone + "-history"}>
                            <td colSpan={7} className="bg-[#F7F9FC] px-5 py-5">
                              <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                  <p className="text-xs font-black uppercase tracking-widest text-[#C8102E]">Student exam history</p>
                                  <h3 className="mt-2 text-xl font-black">{student.name} · {student.exam_count} saved attempts</h3>
                                  <p className="mt-1 text-sm text-slate-500">Average score: {student.average_score.toFixed(1)}%. Every submission is listed newest first.</p>
                                </div>
                                <span className="text-xs text-slate-400">Phone: {displayPhone(student.phone)}</span>
                              </div>
                              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                                {student.attempts.map((attempt, index) => (
                                  <article key={attempt.id || attempt.token || index} className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-[#C8102E]">{titleCase(attempt.subject)} · Mock Test {attempt.test_number}</p>
                                        <p className="mt-1 text-2xl font-black text-[#1B3A6B]">{Number(attempt.score).toFixed(2).replace(/\.00$/, "")}<span className="text-sm font-bold text-slate-400"> / {attempt.total_marks}</span></p>
                                        <p className="mt-1 text-xs font-bold text-slate-500">{attempt.percentage.toFixed(1)}% · {attempt.question_count} questions · {attempt.duration_minutes} minutes</p>
                                      </div>
                                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">Attempt {student.exam_count - index}</span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                      <p className="text-xs leading-5 text-slate-500">Submitted: {dateLabel(attempt.submitted_at)}<br />Screen departures: {attempt.away_count}</p>
                                      <Link href={"/csca/mocktest/result/" + attempt.token} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-[#1B3A6B]">
                                        Open result <ExternalLink className="h-3 w-3" />
                                      </Link>
                                    </div>
                                  </article>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                  {!studentsLoading && filteredStudents.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-12 text-center"><Users className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 font-black">No students found</p><p className="mt-1 text-sm text-slate-500">Student records appear here after a CSCA mock-test submission.</p></td></tr>
                  )}
                  {studentsLoading && (
                    <tr><td colSpan={6} className="px-6 py-12 text-center"><RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#1B3A6B]" /><p className="mt-3 text-sm font-bold text-slate-500">Loading student records…</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-5 py-4 text-xs leading-5 text-slate-500">
              <ShieldCheck className="mr-1 inline h-4 w-4 text-[#1B3A6B]" /> Follow-up messages are sent one student at a time. Thank-you email sending is limited to one successful email per student every 24 hours. WhatsApp opens a personalized draft; review it and send manually.
            </div>
          </section>
        )}

        {mode === "reports" && (
          <section className="mt-5">
            <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
              <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5">
                <h2 className="font-black">Subjects</h2>
                <div className="mt-3 space-y-2">
                  {MOCK_SUBJECTS.map(s => (
                    <button key={s.slug} onClick={() => selectReportSubject(s.slug)} className={"w-full rounded-xl px-3 py-2.5 text-left text-sm font-black " + (subject === s.slug ? "bg-[#1B3A6B] text-white" : "bg-slate-50 text-slate-600")}>{s.title}</button>
                  ))}
                </div>
                <h2 className="mt-6 font-black">Mock tests</h2>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => selectReportTest(n)} className={"rounded-lg px-2 py-2 text-xs font-black " + (test === n ? "bg-[#C8102E] text-white" : "bg-slate-100 text-slate-500")}>{n}</button>
                  ))}
                </div>
              </aside>
              <div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#C8102E]">GL Education · Study in China</p>
                      <h2 className="mt-2 text-2xl font-black">{MOCK_SUBJECTS.find(s => s.slug === subject)?.title} · Mock Test {test}</h2>
                      <p className="mt-1 text-sm text-slate-500">{RELEASED_MOCKS[subject].includes(test) ? "Released" : "Not released yet"} · {rows.length} recorded attempts</p>
                    </div>
                    <button onClick={downloadReports} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-black text-[#1B3A6B] disabled:opacity-40"><Download className="h-4 w-4" /> Download CSV</button>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-blue-50 p-4"><span className="text-xs font-bold text-slate-500">Attempts</span><b className="mt-1 block text-2xl">{rows.length}</b></div>
                    <div className="rounded-2xl bg-emerald-50 p-4"><span className="text-xs font-bold text-slate-500">Average score</span><b className="mt-1 block text-2xl">{rows.length ? (rows.reduce((sum, r) => sum + (Number(r.total_marks) ? Number(r.score) / Number(r.total_marks) * 100 : 0), 0) / rows.length).toFixed(1) + "%" : "—"}</b></div>
                    <div className="rounded-2xl bg-amber-50 p-4"><span className="text-xs font-bold text-slate-500">Screen departures</span><b className="mt-1 block text-2xl">{rows.reduce((sum, r) => sum + Number(r.away_count || 0), 0)}</b></div>
                  </div>
                </div>
                {reportError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{reportError}</p>}
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {rows.map((r, i) => (
                    <article key={r.id || i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <div className="bg-gradient-to-r from-[#071A35] to-[#1B3A6B] p-5 text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">GL Education · Study in China</p>
                        <h3 className="mt-2 text-xl font-black">{r.candidate_name}</h3>
                        <p className="mt-1 text-sm text-slate-300">{displayPhone(r.phone)}</p>
                        <p className="mt-1 break-all text-xs text-slate-300">{r.candidate_email || "Email not recorded"}</p>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between gap-3">
                          <div><span className="text-xs font-bold text-slate-500">Score</span><p className="mt-1 text-3xl font-black text-[#1B3A6B]">{Number(r.score).toFixed(2).replace(/\.00$/, "")}<span className="text-base text-slate-400">/{r.total_marks}</span></p></div>
                          <div className="text-right"><span className="text-xs font-bold text-slate-500">Screen departures</span><p className="mt-1 text-xl font-black text-amber-700">{Number(r.away_count || 0)}</p></div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Submitted: {dateLabel(r.submitted_at)}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={"/csca/mocktest/result/" + r.token} className="rounded-lg border px-3 py-2 text-xs font-black text-[#1B3A6B]">Open result</Link>
                          <a href={"https://wa.me/" + waPhone(r.phone) + "?text=" + encodeURIComponent("Hello " + r.candidate_name + ", thank you for taking a GL Education CSCA mock test. You are welcome to contact us for guidance with CSCA preparation, admission in China, or your study-abroad journey. — GL Education")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-black text-white"><MessageCircle className="h-3.5 w-3.5" /> Prepare WhatsApp message</a>
                        </div>
                      </div>
                    </article>
                  ))}
                  {!reportsLoading && rows.length === 0 && <div className="rounded-3xl border border-dashed bg-white p-10 text-center md:col-span-2"><Users className="mx-auto h-9 w-9 text-slate-300" /><h3 className="mt-4 text-xl font-black">No attempts yet</h3><p className="mt-2 text-sm text-slate-500">Submissions appear after a released mock test is completed.</p></div>}
                  {reportsLoading && <div className="rounded-3xl border bg-white p-10 text-center md:col-span-2"><RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#1B3A6B]" /><p className="mt-3 text-sm text-slate-500">Loading attempts…</p></div>}
                </div>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
