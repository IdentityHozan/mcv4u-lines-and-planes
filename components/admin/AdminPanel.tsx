"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { ManagedLesson } from "@/data/managedLessonTypes";

type SessionState = {
  authenticated: boolean;
  configured: boolean;
  storage: "vercel-blob" | "local-file" | "unconfigured";
};

type LessonForm = {
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  body: string;
  equation: string;
  videoUrl: string;
  takeaways: string;
};

const emptyForm: LessonForm = {
  title: "",
  slug: "",
  subtitle: "",
  summary: "",
  body: "",
  equation: "",
  videoUrl: "",
  takeaways: "",
};

function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function lessonToForm(lesson: ManagedLesson): LessonForm {
  return {
    title: lesson.title,
    slug: lesson.slug,
    subtitle: lesson.subtitle,
    summary: lesson.summary,
    body: lesson.body,
    equation: lesson.equation ?? "",
    videoUrl: lesson.videoUrl ?? "",
    takeaways: lesson.takeaways.join("\n"),
  };
}

export function AdminPanel() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [password, setPassword] = useState("");
  const [lessons, setLessons] = useState<ManagedLesson[]>([]);
  const [form, setForm] = useState<LessonForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadLessons = useCallback(async () => {
    const response = await fetch("/api/admin/lessons", { cache: "no-store" });
    const data = (await response.json()) as { lessons?: ManagedLesson[]; error?: string };
    if (!response.ok) throw new Error(data.error || "Lessons could not be loaded.");
    setLessons(data.lessons ?? []);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const data = (await response.json()) as SessionState;
        setSession(data);
        if (data.authenticated) await loadLessons();
      } catch {
        setError("The administration service could not be reached.");
      }
    })();
  }, [loadLessons]);

  const previewSlug = useMemo(() => form.slug || makeSlug(form.title), [form.slug, form.title]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as SessionState & { error?: string };
      if (!response.ok) throw new Error(data.error || "Sign-in failed.");
      setSession({ authenticated: true, configured: true, storage: data.storage });
      setPassword("");
      await loadLessons();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setSession((current) => current && { ...current, authenticated: false });
    setLessons([]);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveLesson = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const payload = {
      ...form,
      slug: previewSlug,
      takeaways: form.takeaways.split("\n").map((item) => item.trim()).filter(Boolean),
      ...(editingId ? { id: editingId } : {}),
    };

    try {
      const response = await fetch("/api/admin/lessons", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { lesson?: ManagedLesson; error?: string };
      if (!response.ok) throw new Error(data.error || "The lesson could not be saved.");
      setMessage(editingId ? "Lesson updated and published." : "Lesson created and published.");
      setForm(emptyForm);
      setEditingId(null);
      await loadLessons();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "The lesson could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const startEditing = (lesson: ManagedLesson) => {
    setEditingId(lesson.id);
    setForm(lessonToForm(lesson));
    setMessage("");
    setError("");
    document.getElementById("lesson-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  const deleteLesson = async (lesson: ManagedLesson) => {
    const approved = window.confirm(`Delete “${lesson.title}”? This removes the published lesson.`);
    if (!approved) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/lessons?id=${encodeURIComponent(lesson.id)}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "The lesson could not be deleted.");
      setMessage("Lesson deleted.");
      if (editingId === lesson.id) cancelEditing();
      await loadLessons();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "The lesson could not be deleted.");
    } finally {
      setBusy(false);
    }
  };

  if (!session) {
    return <div className="border border-white/10 bg-[#111] p-6 text-sm text-zinc-400">Loading admin settings…</div>;
  }

  if (!session.configured) {
    return (
      <div className="border border-sky-400/25 bg-sky-400/[0.04] p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Admin setup required</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Add <code className="text-sky-300">ADMIN_PASSWORD</code> to <code className="text-sky-300">.env.local</code> for local development and to the Vercel project environment variables for deployment. Restart the server after changing local variables.
        </p>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <form onSubmit={login} className="max-w-lg border border-white/10 bg-[#111] p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Admin sign-in</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">Use the password configured by the site owner. The session lasts for 24 hours.</p>
        <label className="mt-6 block">
          <span className="field-label">Admin password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field-control"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="primary-action mt-6 disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.68fr)] xl:items-start">
      <section id="lesson-editor" className="scroll-mt-28 border border-white/10 bg-[#111] p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="micro-label text-sky-300">Lesson editor</p>
            <h2 className="mt-2 text-2xl font-semibold">{editingId ? "Edit published lesson" : "Create a lesson"}</h2>
          </div>
          <button type="button" onClick={signOut} className="secondary-action">Sign out</button>
        </div>

        {session.storage === "unconfigured" && (
          <p className="mt-6 border border-amber-300/25 bg-amber-300/[0.04] p-4 text-sm leading-6 text-amber-100">
            Connect a Vercel Blob store before publishing. Vercel will add the required storage variable automatically.
          </p>
        )}
        {session.storage === "local-file" && (
          <p className="mt-6 border border-white/10 bg-[#0c0c0c] p-4 text-sm leading-6 text-zinc-400">
            Local mode is active. Lessons are saved in <code className="text-zinc-200">data/adminLessons.json</code>.
          </p>
        )}

        <form onSubmit={saveLesson} className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="field-label">Lesson title</span>
              <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="field-control" placeholder="Example: Review of line intersections" />
            </label>
            <label>
              <span className="field-label">Short subtitle</span>
              <input required value={form.subtitle} onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))} className="field-control" placeholder="What this lesson focuses on" />
            </label>
          </div>

          <label>
            <span className="field-label">Lesson URL</span>
            <div className="grid grid-cols-[auto_1fr] items-center border border-white/10 bg-[#0c0c0c]">
              <span className="border-r border-white/10 px-3 text-xs text-zinc-500">/lessons/</span>
              <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: makeSlug(event.target.value) }))} className="border-0 bg-transparent px-3 py-3 text-sm text-zinc-100 outline-none" placeholder={makeSlug(form.title) || "lesson-url"} />
            </div>
          </label>

          <label>
            <span className="field-label">Summary</span>
            <textarea required rows={3} value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} className="field-control resize-y" placeholder="A clear introduction shown on the lesson index." />
          </label>

          <label>
            <span className="field-label">Lesson material</span>
            <textarea required rows={12} value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} className="field-control resize-y font-mono text-sm leading-7" placeholder={String.raw`Write the explanation here. Inline math uses \(x=1\) and block math uses \[x+y=4\].`} />
            <span className="mt-2 block text-xs leading-5 text-zinc-500">Plain text and MathJax are supported. HTML is displayed as text for safety.</span>
          </label>

          <label>
            <span className="field-label">Featured equation (optional)</span>
            <input value={form.equation} onChange={(event) => setForm((current) => ({ ...current, equation: event.target.value }))} className="field-control font-mono text-sm" placeholder={String.raw`\[\vec r=\vec r_0+t\vec d\]`} />
          </label>

          <label>
            <span className="field-label">YouTube lesson URL (optional)</span>
            <input type="url" value={form.videoUrl} onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))} className="field-control" placeholder="https://www.youtube.com/watch?v=..." />
          </label>

          <label>
            <span className="field-label">Key takeaways (one per line)</span>
            <textarea rows={5} value={form.takeaways} onChange={(event) => setForm((current) => ({ ...current, takeaways: event.target.value }))} className="field-control resize-y" placeholder={'Identify the anchor point.\nCheck the direction vector.\nVerify by substitution.'} />
          </label>

          {error && <p className="border border-red-300/20 bg-red-300/[0.04] p-3 text-sm text-red-200" role="alert">{error}</p>}
          {message && <p className="border border-sky-400/25 bg-sky-400/[0.04] p-3 text-sm text-sky-200" role="status">{message}</p>}

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <button type="submit" disabled={busy || session.storage === "unconfigured"} className="primary-action disabled:cursor-not-allowed disabled:opacity-45">
              {busy ? "Saving…" : editingId ? "Save lesson changes" : "Publish lesson"}
            </button>
            {editingId && <button type="button" onClick={cancelEditing} className="secondary-action">Cancel editing</button>}
          </div>
        </form>
      </section>

      <aside className="border border-white/10 bg-[#0e0e0e] p-5 sm:p-6">
        <div className="flex items-end justify-between border-b border-white/10 pb-5">
          <div>
            <p className="micro-label text-sky-300">Published content</p>
            <h2 className="mt-2 text-xl font-semibold">Additional lessons</h2>
          </div>
          <span className="font-mono text-xs text-zinc-500">{lessons.length}</span>
        </div>

        {lessons.length === 0 ? (
          <p className="py-8 text-sm leading-7 text-zinc-500">No teacher-created lessons have been published. The eight core lessons remain available to students.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {lessons.map((lesson) => (
              <article key={lesson.id} className="py-5">
                <h3 className="text-sm font-semibold text-zinc-200">{lesson.title}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{lesson.subtitle}</p>
                <p className="mt-2 font-mono text-[10px] text-zinc-600">/lessons/{lesson.slug}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/lessons/${lesson.slug}`} className="secondary-action min-h-9 px-3 text-xs">View</Link>
                  <button type="button" onClick={() => startEditing(lesson)} className="secondary-action min-h-9 px-3 text-xs">Edit</button>
                  <button type="button" onClick={() => void deleteLesson(lesson)} disabled={busy} className="min-h-9 border border-red-300/20 px-3 text-xs font-semibold text-red-200 hover:bg-red-300/[0.05] disabled:opacity-40">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
